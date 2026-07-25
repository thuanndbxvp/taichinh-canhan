// One-shot: rewrite prompt registry. Run with: node _apply_prompt_patch.js
const fs = require('fs');
const path = 'src/services/ai/prompts/index.ts';
let c = fs.readFileSync(path, 'utf8');

const oldOutline = `promptRegistry.register('finance.script.outline', {
  version: V1,
  build({ params }) {
    const { title, targetAudience, styleOptions } = params;
    const style = \`Tone: \${styleOptions.expression}, Style: \${styleOptions.style}\`;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: \`Tạo dàn ý đúng cấu trúc 5 phần bắt buộc:
- ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)
- ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)
- ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)
- ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)
- ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)
Cho chủ đề: "\${title}". Ngôn ngữ: \${targetAudience}. Phong cách: \${style}.\`,
        },
      ],
    };
  },
});`;

const newOutline = `promptRegistry.register('finance.script.outline', {
  version: V1,
  build({ params }) {
    const { title, targetAudience, styleOptions } = params;
    const style = \`Tone: \${styleOptions.expression}, Style: \${styleOptions.style}\`;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: \`Tạo dàn ý đúng cấu trúc 5 phần bắt buộc.
QUY TẮC ĐỊNH DẠNG BẮT BUỘC (không tuân thủ = output vô dụng):
- Mỗi phần PHẢI bắt đầu bằng heading markdown cấp 2 với tiêu đề chính xác:
  ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)
  ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)
  ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)
  ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)
  ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)
- KHÔNG dùng heading cấp 3 (###) hay cấp 1 (#) cho phần.
- KHÔNG gộp 2 phần thành 1; mỗi phần là 1 heading riêng.
- KHÔNG thêm bất kỳ text nào TRƯỚC heading "## PHẦN 1".
- Mỗi phần có ÍT NHẤT 3 gạch đầu dòng mô tả ý chính.

Nội dung từng phần:
- PHẦN 1: Hook cụ thể (Tên + Tuổi + Lương) -> Slogan -> Teaser/Disclaimer.
- PHẦN 2: Thực trạng bằng số liệu; bẫy tâm lý khán giả đang mắc.
- PHẦN 3: Bài toán cộng/trừ/nhân/chia; chi phí cơ hội; "Tôi không nói... Tôi đang nói...".
- PHẦN 4: Lộ trình step-by-step; phân nhóm đối tượng áp dụng.
- PHẦN 5: Tục ngữ Việt Nam + 1 câu hỏi xoáy vào khán giả (CTA).

Chủ đề: "\${title}". Ngôn ngữ: \${targetAudience}. Phong cách: \${style}.\`,
        },
      ],
    };
  },
});`;

if (!c.includes(oldOutline)) {
  console.error('OLD OUTLINE NOT FOUND');
  process.exit(1);
}
c = c.replace(oldOutline, newOutline);

const oldPart = `promptRegistry.register('finance.script.part', {
  version: V1,
  build({ params, currentPartOutline, fullOutline, previousPartsScript }) {
    const { targetAudience, title, styleOptions } = params;
    const style = \`DUY TRÌ TÔNG GIỌNG (Tone): \${styleOptions.expression} VÀ PHONG CÁCH (Style): \${styleOptions.style}.\`;
    const arc = arcInstructionFor(currentPartOutline);
    void fullOutline;
    void previousPartsScript;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: \`VIẾT TIẾP PHẦN KỊCH BẢN: "\${currentPartOutline}".\\nCHỦ ĐỀ: \${title}.\\nCHỈ DẪN: \${arc}\\n\${style}\\nNGÔN NGỮ: \${targetAudience}.\\nBẮT BUỘC BẮT ĐẦU BẰNG TIÊU ĐỀ ##.\`,
        },
      ],
    };
  },
});`;

const newPart = `promptRegistry.register('finance.script.part', {
  version: V1,
  build({ params, currentPartOutline, fullOutline, previousPartsScript }) {
    const { targetAudience, title, styleOptions } = params;
    const style = \`DUY TRÌ TÔNG GIỌNG (Tone): \${styleOptions.expression} VÀ PHONG CÁCH (Style): \${styleOptions.style}.\`;
    const arc = arcInstructionFor(currentPartOutline);
    void fullOutline;
    void previousPartsScript;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: \`VIẾT TIẾP PHẦN KỊCH BẢN: "\${currentPartOutline}".
CHỦ ĐỀ: \${title}.

CHỈ DẪN THEO PHẦN: \${arc}

\${style}
NGÔN NGỮ: \${targetAudience}.

QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
- Phải viết lại TOÀN BỘ heading "## PHẦN X: ..." (đúng định dạng markdown cấp 2) ở dòng đầu tiên.
- Phần nội dung bắt đầu từ dòng thứ 2.
- KHÔNG viết tiêu đề cấp 3 (###) hay cấp 1 (#).
- KHÔNG thêm "## PHẦN" khác ngoài phần được giao.\`,
        },
      ],
    };
  },
});`;

if (!c.includes(oldPart)) {
  console.error('OLD PART NOT FOUND');
  process.exit(1);
}
c = c.replace(oldPart, newPart);

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
