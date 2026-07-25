import type { Expression, Style } from '../types';

export const EXPRESSION_EXPLANATIONS: Record<Expression, string> = {
  'Empathetic': 'Thể hiện sự đồng cảm, thấu hiểu với cảm xúc và tình huống của khán giả, tạo sự kết nối sâu sắc — phù hợp với kênh Chú Que Tài Chính khi nói về tiền bạc.',
  'Conversational': 'Sử dụng lối nói chuyện thân mật, tự nhiên như đang trò chuyện với bạn bè, giảm khoảng cách với người xem.',
  'Authoritative': 'Thể hiện sự tự tin, chắc chắn và am hiểu sâu sắc về chủ đề, tạo cảm giác của một chuyên gia.',
  'Analytical': 'Phân tích sắc bén, mổ xẻ vấn đề bằng số liệu và logic — phù hợp với phần Giải phẫu trong kịch bản tài chính.',
};


export const STYLE_EXPLANATIONS: Record<Style, string> = {
  'Narrative': 'Kể lại một câu chuyện có đầu có cuối, với nhân vật, bối cảnh và diễn biến sự việc.',
  'Storytelling': 'Kể chuyện qua một nhân vật cụ thể (Tên + Tuổi + Mức lương + Vấn đề) minh hoạ xuyên suốt video — phù hợp với phong cách Chú Que Tài Chính.',
  'Educational': 'Dạy học theo từng bước, có ví dụ và bài tập để khán giả áp dụng ngay.',
  'Analytical': 'Phân tích số liệu, bóc tách chi phí ẩn, chi phí cơ hội bằng toán học (cộng/trừ/nhân/chia) — phù hợp với phần Giải phẫu trong kịch bản tài chính.',
};

export const FORMATTING_EXPLANATIONS = {
  wordCount: 'Xác định độ dài ước tính cho kịch bản. Với video dài (>1000 từ), AI sẽ tạo dàn ý chi tiết trước để đảm bảo chất lượng và sự logic.',
  videoDuration: 'Nhập thời lượng video mong muốn (tính bằng phút). AI sẽ tự động ước tính số từ cần thiết (khoảng 150 từ/phút) để tạo kịch bản có độ dài phù hợp.',
  scriptParts: 'Chia kịch bản thành số phần chính mong muốn. Chọn "Tự động" để AI quyết định cấu trúc tốt nhất dựa trên chủ đề.',
  includeIntro: 'Tự động tạo một đoạn mở đầu hấp dẫn để thu hút và giữ chân người xem ngay từ những giây đầu tiên.',
  includeOutro: 'Tự động tạo một đoạn kết luận, tóm tắt nội dung và bao gồm lời kêu gọi hành động (call-to-action).',
  headings: 'Sử dụng các tiêu đề (ví dụ: ## Phần 1) để phân chia rõ ràng các phần chính trong kịch bản.',
  bullets: 'Dùng gạch đầu dòng hoặc danh sách có số thứ tự để trình bày thông tin một cách cô đọng, dễ theo dõi.',
  bold: 'Làm nổi bật các từ khoá hoặc điểm chính bằng cách in đậm/in nghiêng chúng trong văn bản.',
};
