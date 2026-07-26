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
 * Dịch vụ lấy dữ liệu vĩ mô bằng Tavily Search.
 */
export const fetchMacroData = async (
  title: string,
  provider: AiProvider,
  model: string
): Promise<string> => {
  const tavilyKey = localStorage.getItem('tavily-api-key') || '';
  
  if (!tavilyKey.trim()) {
    console.log(`[Data Retrieval] Bỏ qua Web Search vì chưa cấu hình Tavily API Key.`);
    return `[LƯU Ý]: Không tự động lấy được dữ liệu vĩ mô (Tavily Key chưa cấu hình). Hãy dựa vào nguyên lý gốc.`;
  }

  console.log(`[Data Retrieval] Đang yêu cầu AI Planner lên kế hoạch tìm kiếm cho: ${title}`);
  
  try {
    // 1. Dùng AI Planner để tạo queries
    const plannerResult = await callWithPrompt(
      provider,
      model,
      'finance.data.planner',
      { title },
      'lên kế hoạch tìm kiếm',
      { temperature: 0.2 },
    );
    
    let queries: string[] = [];
    try {
      const match = plannerResult.match(/\[.*\]/s);
      if (match) {
        queries = JSON.parse(match[0]);
      }
    } catch (e) {
      console.warn('Không parse được JSON từ AI Planner, fallback về query mặc định', e);
    }
    
    if (!queries || queries.length === 0) {
      queries = [`số liệu kinh tế vĩ mô mới nhất về ${title}`];
    }

    console.log(`[Data Retrieval] Các truy vấn sẽ thực hiện:`, queries);

    // 2. Chạy tìm kiếm song song
    const searchPromises = queries.map(q => performTavilySearch(q, tavilyKey));
    const results = await Promise.all(searchPromises);
    
    const combinedData = results.filter(r => r.trim() !== '').join('\n\n---\n\n');
    
    if (!combinedData) {
      return `Không tìm thấy dữ liệu vĩ mô mới nhất trên Web.`;
    }
    return combinedData;
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu vĩ mô:', error);
    return `[LƯU Ý]: Lỗi kết nối công cụ tìm kiếm hoặc AI Planner. Hãy phân tích dựa trên nguyên lý tài chính căn bản thay vì bịa số liệu.`;
  }
};
