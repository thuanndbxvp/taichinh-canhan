import { useCallback, useState } from 'react';
import type { AiProvider, WordCountStats } from '../../../types';
import { extractDialogue } from '../../../services/aiService';
import { countWords } from '../../lib/markdown';

const FALLBACK_STRIP_OPTIONS = [
  /^\*\*#+/,
  /\*\*/g,
  /^#+\s+/,
];

function cleanTitle(line: string): string {
  const trimmed = line.trim();
  let result = trimmed;
  for (const pattern of FALLBACK_STRIP_OPTIONS) {
    result = result.replace(pattern, '');
  }
  return result.trim() || 'Phần không tên';
}

function localParse(script: string): Record<string, string> {
  const sections = script
    .split(/(?=^#+ .*?$|^### Dàn Ý|^#{0,3}\s*\*\*#+ .*?)/m)
    .filter((s) => s.trim() !== '' && !s.includes('---') && !s.includes('### Dàn Ý'));

  const dialogue: Record<string, string> = {};
  for (const section of sections) {
    const lines = section.split('\n');
    const title = cleanTitle(lines[0]);
    const contentLines = lines.slice(1);
    const filtered = contentLines
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        if (trimmed === '***') return false;
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) return false;
        if (/^Visual:|^SFX:|^Audio:|^Scene:|^Camera:/i.test(trimmed)) return false;
        if (/^\*\*\(.*?\)\*\*/.test(trimmed)) return false;
        if (/^\*\*#+/.test(trimmed)) return false;
        return true;
      })
      .map((line) =>
        line
          .replace(/\*\*\s*\(.*?\)\s*\*\*/g, '')
          .replace(/\*\s*\(.*?\)\s*\*/g, '')
          .replace(/\*\*\s*#+.*?\*\*/g, '')
          .replace(/\*\*\*/g, '')
          .trim(),
      )
      .filter((line) => line.length > 0)
      .join('\n')
      .trim();

    if (filtered) dialogue[title] = filtered;
  }
  return dialogue;
}

export interface UseDialogueWorkflowArgs {
  aiProvider: AiProvider;
  selectedModel: string;
}

export interface UseDialogueWorkflowReturn {
  dialogue: Record<string, string> | null;
  isExtracting: boolean;
  error: string | null;
  stats: WordCountStats | null;
  extract: (script: string) => Promise<void>;
  clear: () => void;
}

/**
 * Tách lời thoại + đếm từ:
 * - Ưu tiên parse offline nhanh.
 * - Fallback gọi AI nếu output quá nhiều marker hoặc rỗng.
 */
export function useDialogueWorkflow({ aiProvider, selectedModel }: UseDialogueWorkflowArgs): UseDialogueWorkflowReturn {
  const [dialogue, setDialogue] = useState<Record<string, string> | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WordCountStats | null>(null);

  const extract = useCallback(
    async (script: string) => {
      if (!script) return;
      setIsExtracting(true);
      setError(null);
      try {
        let result = localParse(script);
        const totalChars = Object.values(result).join('').length;
        const hasMarkers = /#|\*\*|\[|\]/g.test(Object.values(result).join(''));
        if (Object.keys(result).length === 0 || (totalChars > 100 && hasMarkers)) {
          result = await extractDialogue(script, aiProvider, selectedModel);
        }
        setDialogue(result);
        const sections = Object.entries(result).map(([title, text]) => ({
          title,
          count: countWords(text),
        }));
        const total = sections.reduce((sum, s) => sum + s.count, 0);
        setStats({ sections, total });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tách lời thoại.');
      } finally {
        setIsExtracting(false);
      }
    },
    [aiProvider, selectedModel],
  );

  const clear = useCallback(() => {
    setDialogue(null);
    setStats(null);
    setError(null);
  }, []);

  return { dialogue, isExtracting, error, stats, extract, clear };
}
