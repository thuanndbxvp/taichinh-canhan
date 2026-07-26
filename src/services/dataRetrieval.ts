import { callWithPrompt } from './ai/AiGateway';
import type { AiProvider } from '../../types';

/**
 * Dịch vụ lấy dữ liệu vĩ mô (Data Retrieval).
 * Thay vì gọi API bên ngoài (SerpAPI), chúng ta tận dụng luôn LLM hiện tại 
 * (ví dụ GPT-4o hoặc các model có hỗ trợ knowledge base mới) để trích xuất 
 * các số liệu vĩ mô kinh tế, lạm phát, giá vàng...
 */
export const fetchMacroData = async (
  title: string,
  provider: AiProvider,
  model: string
): Promise<string> => {
  console.log(`[Data Retrieval] Đang yêu cầu AI tổng hợp dữ liệu vĩ mô cho: ${title}`);
  
  try {
    const data = await callWithPrompt(
      provider,
      model,
      'finance.data.retrieve',
      { title },
      'thu thập dữ liệu vĩ mô',
      { temperature: 0.3 } // Temperature thấp để hạn chế ảo giác
    );
    return data;
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu vĩ mô bằng AI:', error);
    return `[LƯU Ý]: Không thể tự động lấy dữ liệu vĩ mô. Hãy phân tích dựa trên nguyên lý tài chính căn bản.`;
  }
};
