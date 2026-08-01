import type { AiProvider } from '../../types';
import { callWithPrompt } from './ai/AiGateway';

export async function performTavilySearch(query: string, tavilyKey: string): Promise<string> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: tavilyKey,
      query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 2,
    }),
  });
  if (!response.ok) return '';
  const data = await response.json();
  if (data.answer) return data.answer;
  if (data.results && data.results.length > 0) {
    return data.results.map((r: any) => `- ${r.title}: ${r.content}`).join('\n');
  }
  return '';
}

/**
 * Deep Research pipeline (RAG 4 bước) cho kênh tài chính.
 *
 * Flow:
 *   1. FACET — dùng AI tách chủ đề thành 3-5 truy vấn Google cụ thể.
 *   2. SEARCH — chạy `performTavilySearch` song song cho từng truy vấn.
 *   3. SYNTHESIS — gộp dữ liệu thô thành bản "Tóm Tắt Nghiên Cứu" có cấu trúc.
 *   4. FACTCHECK + REVISE — Tổng Biên Tập phê bình → biên tập viên viết lại.
 *
 * Trả về chuỗi Research Summary cuối cùng (sẽ được gán vào `params.macroContext`
 * để prompt `finance.script.outline` sử dụng).
 */
export const performDeepResearch = async (
  title: string,
  outlineContent: string,
  provider: AiProvider,
  model: string,
  onProgress?: (message: string) => void,
): Promise<string> => {
  const tavilyKey = (typeof localStorage !== 'undefined'
    ? localStorage.getItem('tavily-api-key') || ''
    : '').trim();

  const reportProgress = (msg: string) => {
    if (onProgress) onProgress(msg);
    console.log(`[Deep Research] ${msg}`);
  };

  // Nếu không có Tavily key, vẫn cho chạy pipeline nhưng dữ liệu search sẽ rỗng.
  if (!tavilyKey) {
    reportProgress('Chưa cấu hình Tavily API Key — bỏ qua bước tìm kiếm web.');
  }

  try {
    // 1. FACET — tách chủ đề thành 3-5 truy vấn.
    reportProgress('Đang phân tích chủ đề thành các khía cạnh cần tìm kiếm...');
    let queries: string[] = [];
    try {
      const facetRaw = await callWithPrompt(
        provider,
        model,
        'finance.research.facet',
        { title },
        'phân tách khía cạnh tìm kiếm',
        { temperature: 0.3 },
      );
      const match = facetRaw.match(/\[[\s\S]*\]/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) {
          queries = parsed.filter((q): q is string => typeof q === 'string' && q.trim() !== '');
        }
      }
    } catch (e) {
      console.warn('[Deep Research] FACET step failed, fallback về query mặc định', e);
    }

    if (queries.length === 0) {
      queries = [`số liệu kinh tế thực tế mới nhất về ${title}`];
    }

    // 2. SEARCH — chạy Tavily song song (nếu có key).
    let searchResults = '';
    if (tavilyKey) {
      reportProgress(`Đang cào dữ liệu (${queries.length} truy vấn) trên web...`);
      const results = await Promise.all(queries.map(q => performTavilySearch(q, tavilyKey)));
      searchResults = queries
        .map((q, i) => `Truy vấn: ${q}\nKết quả:\n${results[i] || '(không có kết quả)'}`)
        .join('\n\n---\n\n');
    } else {
      searchResults = '(Bỏ qua search vì thiếu Tavily API key. Hãy dựa vào nguyên lý tài chính căn bản và ngữ cảnh chủ đề.)';
    }

    // 3. SYNTHESIS — tổng hợp thành Research Summary.
    reportProgress('Đang tổng hợp dữ liệu thành Tóm Tắt Nghiên Cứu...');
    let researchSummary = '';
    try {
      researchSummary = await callWithPrompt(
        provider,
        model,
        'finance.research.synthesis',
        { title, outlineContent, searchResults },
        'tổng hợp nghiên cứu',
        { temperature: 0.4 },
      );
    } catch (e) {
      console.error('[Deep Research] SYNTHESIS step failed', e);
      researchSummary = `[LƯU Ý]: Không tổng hợp được research summary. Lỗi: ${e instanceof Error ? e.message : String(e)}`;
    }

    // 4. FACTCHECK — kiểm duyệt chất lượng bản tóm tắt.
    reportProgress('Đang kiểm duyệt chất lượng bản tóm tắt...');
    let critique = '';
    try {
      const factcheckRaw = await callWithPrompt(
        provider,
        model,
        'finance.research.factcheck',
        { title, researchSummary },
        'kiểm duyệt research',
        { temperature: 0.2 },
      );
      const match = factcheckRaw.match(/\{[\s\S]*\}/);
      if (match) {
        critique = match[0];
      } else {
        critique = factcheckRaw;
      }
    } catch (e) {
      console.warn('[Deep Research] FACTCHECK step failed, skip revise', e);
    }

    // 4b. REVISE — viết lại nếu có critique.
    if (critique.trim()) {
      reportProgress('Đang tinh chỉnh lại bản tóm tắt dựa trên phê bình...');
      try {
        const revised = await callWithPrompt(
          provider,
          model,
          'finance.research.revise',
          { title, researchSummary, critique },
          'tinh chỉnh research',
          { temperature: 0.4 },
        );
        if (revised && revised.trim()) {
          researchSummary = revised;
        }
      } catch (e) {
        console.warn('[Deep Research] REVISE step failed, giữ nguyên bản synthesis', e);
      }
    }

    reportProgress('Hoàn tất Deep Research.');
    return researchSummary;
  } catch (error) {
    console.error('Lỗi khi chạy Deep Research pipeline:', error);
    return `[LƯU Ý]: Lỗi kết nối trong quá trình Deep Research. Hãy phân tích dựa trên nguyên lý tài chính căn bản thay vì bịa số liệu.`;
  }
};
