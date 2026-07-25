/**
 * ResearchPack — gói nghiên cứu cho Finance Content Studio (Phase 4 đầy đủ).
 *
 * Phase 3 chỉ cần khung: user có thể attach sources/claims vào document.
 * Việc dùng claims để verify kịch bản là Phase 4.
 */
export const RESEARCH_PACK_SCHEMA_VERSION = 1;

export type SourceType = 'article' | 'report' | 'data' | 'expert' | 'book' | 'other';

export interface ResearchSource {
  id: string;
  type: SourceType;
  title: string;
  url?: string;
  author?: string;
  /**
   * Ngày dữ liệu (ISO string).
   */
  dataDate?: string;
  /**
   * Mức độ tin cậy 1-5.
   */
  reliability: 1 | 2 | 3 | 4 | 5;
}

export type ClaimStatus = 'unverified' | 'verified' | 'contested' | 'outdated';
export type ClaimRisk = 'low' | 'medium' | 'high';

export interface ResearchClaim {
  id: string;
  /**
   * Nội dung claim (text ngắn).
   */
  text: string;
  sourceIds: string[];
  status: ClaimStatus;
  risk: ClaimRisk;
  /**
   * Section/scene sử dụng (tuỳ chọn).
   */
  usedIn?: string[];
}

export interface ResearchPack {
  schemaVersion: number;
  sources: ResearchSource[];
  claims: ResearchClaim[];
}

export function createEmptyResearchPack(): ResearchPack {
  return {
    schemaVersion: RESEARCH_PACK_SCHEMA_VERSION,
    sources: [],
    claims: [],
  };
}