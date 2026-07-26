import type { AiProvider } from '../../types';

const TAVILY_TEST_KEY = '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';

/**
 * Dịch vụ lấy dữ liệu vĩ mô bằng Tavily Search.
 * Ở Phase 1, tạm thời fix cứng API Key Tavily để test tính năng Web Search 
 * mà không cần phải thay đổi cấu trúc quản lý API Key hiện tại của app.
 */
export const fetchMacroData = async (
  title: string,
  _provider: AiProvider,
  _model: string
): Promise<string> => {
  console.log(`[Data Retrieval] Đang yêu cầu Tavily tìm kiếm dữ liệu vĩ mô cho: ${title}`);
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_TEST_KEY,
        query: `số liệu kinh tế vĩ mô mới nhất về ${title}`,
        search_depth: "basic",
        include_answer: true,
        max_results: 3
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Tavily trả về 'answer' (LLM-generated summary) và 'results'
    if (data.answer) {
      return data.answer;
    }
    
    if (data.results && data.results.length > 0) {
      return data.results.map((r: any) => `- ${r.title}: ${r.content}`).join('\n');
    }

    return `Không tìm thấy dữ liệu vĩ mô mới nhất trên Web.`;
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu vĩ mô từ Tavily:', error);
    return `[LƯU Ý]: Lỗi kết nối công cụ tìm kiếm. Hãy phân tích dựa trên nguyên lý tài chính căn bản thay vì bịa số liệu.`;
  }
};
