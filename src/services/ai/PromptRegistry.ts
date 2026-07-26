/**
 * PromptRegistry — registry các prompt versioned theo use case.
 *
 * Mỗi prompt là 1 builder function nhận input typed và trả string hoàn chỉnh
 * (system + user messages). Versioning đảm bảo khi thay đổi prompt ta biết
 * chính xác phiên bản nào đang chạy (log/debug/A/B test).
 *
 * Rule:
 *   - KHÔNG inline prompt string trong hook/service. Phải qua registry.
 *   - Khi sửa prompt: bump version + log lại trong docs/plan1.md.
 *   - Có thể truy cứu bằng `promptRegistry.get('finance.script')` để UI show.
 */
import type { GenerationParams, StyleOptions, SummarizeConfig, SceneSummary } from '../../../types';

export interface PromptVersion {
  version: string;
  /**
   * Ngày tạo/cập nhật (ISO).
   */
  updatedAt: string;
  /**
   * Ghi chú thay đổi ngắn.
   */
  notes?: string;
}

export type PromptId =
  | 'finance.script'
  | 'finance.script.outline'
  | 'finance.script.part'
  | 'finance.script.revise'
  | 'finance.script.revise.partial'
  | 'finance.dialogue.extract'
  | 'finance.visual.single'
  | 'finance.visual.bulk'
  | 'finance.scenes.summarize'
  | 'finance.video.single'
  | 'finance.score'
  | 'finance.style.suggest'
  | 'finance.topics.suggest'
  | 'finance.keywords.suggest'
  | 'finance.ideas.fromFile'
  | 'default.script'
  | 'default.script.outline'
  | 'default.script.part';

export interface PromptContext<P> {
  version: PromptVersion;
  /**
   * Build ra mảng messages cho chat completion.
   */
  build(input: P): { messages: Array<{ role: 'system' | 'user'; content: string }> };
}

export interface PromptRegistryMap {
  'finance.script': { params: GenerationParams };
  'finance.script.outline': { params: GenerationParams };
  'finance.script.part': {
    params: GenerationParams;
    fullOutline: string;
    previousPartsScript: string;
    currentPartOutline: string;
  };
  'finance.script.revise': {
    script: string;
    revisionPrompt: string;
    style: StyleOptions | null;
  };
  'finance.script.revise.partial': {
    script: string;
    revisionPrompt: string;
    style: StyleOptions | null;
  };
  'finance.dialogue.extract': { script: string };
  'finance.visual.single': { sceneDescription: string };
  'finance.visual.bulk': { script: string };
  'finance.scenes.summarize': { script: string; config: SummarizeConfig };
  'finance.video.single': { scene: SceneSummary; config: SummarizeConfig };
  'finance.score': { script: string };
  'finance.style.suggest': { title: string };
  'finance.topics.suggest': { title: string };
  'finance.keywords.suggest': { title: string };
  'finance.ideas.fromFile': { content: string };
  'finance.router.classify': { title: string };
  'finance.data.retrieve': { title: string };
  'finance.score.outline': { script: string };
  'finance.data.planner': { title: string };
  'finance.script.factcheck': { outline: string; macroContext?: string };
  'default.script': { params: GenerationParams };
  'default.script.outline': { params: GenerationParams };
  'default.script.part': {
    params: GenerationParams;
    currentPartOutline: string;
    title: string;
  };
}

class PromptRegistry {
  private store: Map<string, PromptContext<unknown>> = new Map();

  register<K extends keyof PromptRegistryMap>(
    id: K,
    prompt: PromptContext<PromptRegistryMap[K]>,
  ) {
    this.store.set(id, prompt as PromptContext<unknown>);
  }

  get<K extends keyof PromptRegistryMap>(
    id: K,
  ): PromptContext<PromptRegistryMap[K]> {
    const p = this.store.get(id);
    if (!p) {
      throw new Error(`Prompt chưa đăng ký: ${id}`);
    }
    return p as PromptContext<PromptRegistryMap[K]>;
  }

  /**
   * Helper build trực tiếp → messages.
   */
  build<K extends keyof PromptRegistryMap>(
    id: K,
    input: PromptRegistryMap[K],
  ): { messages: Array<{ role: 'system' | 'user'; content: string }> } {
    return this.get(id).build(input);
  }

  /**
   * Liệt kê tất cả prompt kèm version (cho UI debug / dump).
   */
  list(): Array<{ id: string; version: PromptVersion }> {
    return Array.from(this.store.entries()).map(([id, p]) => ({
      id,
      version: (p as PromptContext<unknown>).version,
    }));
  }
}

export const promptRegistry = new PromptRegistry();
