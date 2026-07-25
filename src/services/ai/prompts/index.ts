/**
 * Prompt registry cho kênh "Chú Que Tài Chính".
 *
 * Side-effect import: đăng ký toàn bộ finance.* prompts.
 * App cá nhân hoá — chỉ phục vụ nhân vật Chú Que, không còn default.*
 * hay horror/space/scifi prompts.
 *
 * DNA lõi (FINANCE_DNA) là triết lý bất biến của kênh.
 */
import { promptRegistry } from '../PromptRegistry';
import type { StyleOptions } from '../../../../types';

const V1 = { version: '1.0.0', updatedAt: '2026-07-25', notes: 'Phase 5 baseline — Chú Que Tài Chính only' } as const;

const FINANCE_DNA = `
BẠN LÀ CHÚ QUE TÀI CHÍNH — CHUYÊN GIA TÀI CHÍNH CÁ NHÂN VÀ CONTENT CREATOR KÊNH YOUTUBE "CHÚ QUE TÀI CHÍNH".
VAI TRÒ: Bạn đóng vai trò như một "bác sĩ giải phẫu" các vấn đề tiền bạc. Phong cách thực dụng, sắc bén, hoàn toàn dựa trên dữ liệu thật, toán học và logic.

NGÔN NGỮ MẶC ĐỊNH: Tiếng Việt. Luôn viết kịch bản bằng tiếng Việt trừ khi người dùng yêu cầu khác.

8 QUY TẮC BẮT BUỘC:
1. Slogan cố định: Ở phần Mở đầu, bắt buộc phải có câu: "Chào mừng bạn đến với Chú Que Tài Chính, nơi chúng ta nói về tiền bạc theo cách thẳng thật và dễ hiểu nhất".
2. Bóc tách "Chi phí ẩn": Bóc tách tối đa mọi loại phí mà ít ai để ý (VD: lạm phát, phí giao dịch, bảo hiểm, khấu hao).
3. Khai thác "Chi phí cơ hội": Luôn tính toán xem nếu dùng số tiền đó để đầu tư sinh lời thì sẽ ra sao.
4. Tâm lý học hành vi: Gọi tên các điểm mù tâm lý (hiệu ứng chi phí chìm, ảo giác doanh thu, thiên kiến hiện tại).
5. Phân loại & Giải pháp: Đánh số luận điểm rành mạch. Kết thúc bằng bộ giải pháp (Step-by-step) cụ thể và phân loại nhóm người.
6. Kỹ thuật Kể chuyện (Micro-Storytelling): Không nói chung chung. Hãy luôn tạo ra một nhân vật cụ thể ở đầu video (Tên + Tuổi + Mức lương + Vấn đề đang gặp phải) để làm ví dụ xuyên suốt.
7. Bẻ gãy phản biện (Pre-empting Objections): Phải đoán trước khán giả sẽ tự ái/cãi lại ở đâu và dùng cấu trúc: "Tôi không nói [Điều khán giả sợ bị phán xét]... Tôi đang nói [Bản chất logic của vấn đề]".
8. Ẩn dụ và Ngôn ngữ địa phương: Dùng ít nhất 1 hình ảnh ẩn dụ vật lý (vd: cái xô thủng) để giải thích rủi ro. Chốt lại bài học bằng 1 câu tục ngữ/thành ngữ Việt Nam.

GIỌNG ĐIỆU CỐT LÕI:
- Thẳng thật, phũ phàng, không vẽ "bánh vẽ" làm giàu nhanh, không nói đạo lý suông.
- Nói bằng toán học (cộng/trừ/nhân/chia rõ ràng), không nói cảm xúc chung chung.
- Đồng cảm với nỗi đau nhưng dùng số liệu và logic để kéo khán giả về thực tại.`;

const FINANCE_VISUAL_TEMPLATE = `Professional financial vector art, modern flat design style.
Clean lines, vibrant colors like green, blue, gold, and white.
Business context, charts, graphs, money, success.
Bright and clear lighting.
Highly professional and trustworthy atmosphere.
No horror elements, no dark themes.
Aspect ratio 16:9.
[INSERT IMAGE CONTENT HERE]`;

const styleInstruction = (s: StyleOptions): string =>
  `YÊU CẦU VỀ PHONG CÁCH VÀ LỐI DIỄN ĐẠT (TUÂN THỦ TUYỆT ĐỐI):
- Tone (Tông giọng): ${s.expression} (Hãy thể hiện rõ nét tông giọng này xuyên suốt kịch bản).
- Style (Phong cách viết): ${s.style}.`;

function arcInstructionFor(partOutline: string): string {
  const upper = partOutline.toUpperCase();
  if (upper.includes('PHẦN 1') || upper.includes('MỞ ĐẦU') || upper.includes('HOOK')) {
    return 'Bắt buộc chèn Slogan: "Chào mừng bạn đến với Chú Que Tài Chính...". Dùng 1 trong 5 công thức Hook. QUAN TRỌNG: Hãy tạo ra một nhân vật cụ thể (Micro-storytelling với Tên + Tuổi + Mức lương) để dẫn dắt vấn đề.';
  }
  if (upper.includes('PHẦN 2') || upper.includes('BỐI CẢNH') || upper.includes('PROBLEM')) {
    return 'Nêu thực trạng bằng số liệu thị trường thực tế. Chỉ ra cái bẫy tâm lý mà nhiều người đang mắc kẹt. Tiếp tục sử dụng câu chuyện của nhân vật đã tạo ở Phần 1.';
  }
  if (upper.includes('PHẦN 3') || upper.includes('GIẢI PHẪU') || upper.includes('ANALYSIS')) {
    return 'PHẦN QUAN TRỌNG NHẤT: Bắt buộc mổ xẻ vấn đề bằng các bài toán kinh tế (cộng/trừ/nhân/chia). Sử dụng kỹ thuật Bẻ gãy phản biện "Tôi không nói... Tôi đang nói...". Có thể dùng Ẩn dụ vật lý (vd: cái xô thủng) để minh họa.';
  }
  if (upper.includes('PHẦN 4') || upper.includes('GIẢI PHÁP') || upper.includes('ACTIONABLE')) {
    return 'Cung cấp lộ trình Step-by-step. Nêu rõ giải pháp này dành cho ai và không dành cho ai.';
  }
  if (upper.includes('PHẦN 5') || upper.includes('ĐÚC KẾT') || upper.includes('TAKEAWAY')) {
    return 'Chốt lại 1 câu triết lý tài chính sâu sắc bằng một câu Tục ngữ/Thành ngữ Việt Nam. Kêu gọi hành động (CTA) bằng cách đặt 1 câu hỏi thực tế xoáy vào hoàn cảnh của khán giả.';
  }
  return 'Trình bày kiến thức tài chính một cách mạch lạc, chuyên nghiệp và có tính ứng dụng cao.';
}

// --- Registrations ---

promptRegistry.register('finance.script', {
  version: V1,
  build({ params }) {
    const { title, targetAudience, wordCount, styleOptions } = params;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `${styleInstruction(styleOptions)}\nVIẾT KỊCH BẢN TÀI CHÍNH CÁ NHÂN THEO CẤU TRÚC: "${title}".\nNGÔN NGỮ: ${targetAudience}. ĐỘ DÀI: ${wordCount} từ.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.outline', {
  version: V1,
  build({ params }) {
    const { title, targetAudience, styleOptions } = params;
    const style = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `Tạo dàn ý đúng cấu trúc 5 phần bắt buộc:
- ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)
- ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)
- ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)
- ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)
- ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)
Cho chủ đề: "${title}". Ngôn ngữ: ${targetAudience}. Phong cách: ${style}.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.part', {
  version: V1,
  build({ params, currentPartOutline, fullOutline, previousPartsScript }) {
    const { targetAudience, title, styleOptions } = params;
    const style = `DUY TRÌ TÔNG GIỌNG (Tone): ${styleOptions.expression} VÀ PHONG CÁCH (Style): ${styleOptions.style}.`;
    const arc = arcInstructionFor(currentPartOutline);
    void fullOutline;
    void previousPartsScript;
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `VIẾT TIẾP PHẦN KỊCH BẢN: "${currentPartOutline}".\nCHỦ ĐỀ: ${title}.\nCHỈ DẪN: ${arc}\n${style}\nNGÔN NGỮ: ${targetAudience}.\nBẮT BUỘC BẮT ĐẦU BẰNG TIÊU ĐỀ ##.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.revise', {
  version: V1,
  build({ script, revisionPrompt, style }) {
    const styleLine = style
      ? `Giữ vững Tone: ${style.expression} và Style: ${style.style}.`
      : '';
    const financeGuard =
      'LƯU Ý: Giữ vững triết lý cung cấp kiến thức tài chính thực tế và chuyên nghiệp. Không thêm yếu tố giật gân, kinh dị hay clickbait.';
    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}".\n${financeGuard}\n${styleLine}\n\nKịch bản gốc:\n${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.dialogue.extract', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý tách lời thoại. Trả về JSON object { "Phần X": "lời thoại sạch" }.',
        },
        {
          role: 'user',
          content: `NHIỆM VỤ: Trích xuất lời thoại SẠCH TUYỆT ĐỐI (Spoken text only) từ kịch bản sau.

QUY TẮC NGHIÊM NGẶT (MUST FOLLOW):
1. LOẠI BỎ TRIỆT ĐỂ:
   - Tất cả các ký hiệu điều hướng như ##, ###, ****, ---, ***.
   - Tất cả tiêu đề phần như "THE HOOK", "**## THE SLOW BURN**".
   - Tất cả các ghi chú kỹ thuật: [SFX], [Scene], Visual:, Audio:, Camera:, SFX:.
   - Tất cả các ghi chú tông giọng hoặc hành động trong ngoặc: (Narrator Voice), (Whispering), (Action), **(Narrator)**.
2. CHỈ GIỮ LẠI: Nội dung văn bản mà con người thực sự ĐỌC THÀNH LỜI trong video.
3. ĐỊNH DẠNG ĐẦU RA: JSON object. Key là tên phần (VD: "Phần 1"), Value là văn bản SẠCH đã xử lý.

KỊCH BẢN CẦN TRÍCH XUẤT:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.visual.single', {
  version: V1,
  build({ sceneDescription }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý tạo prompt hình ảnh tài chính chuyên nghiệp. Luôn trả JSON array.',
        },
        {
          role: 'user',
          content: `NHIỆM VỤ: Tạo 4 prompt hình ảnh cực kỳ chi tiết cho Midjourney/Leonardo.
PHONG CÁCH BẮT BUỘC: Professional Financial Aesthetic (Chuyên nghiệp, sáng sủa, văn phòng).
MẪU CẤU TRÚC (BẮT BUỘC SỬ DỤNG):
${FINANCE_VISUAL_TEMPLATE}

Hãy thay thế [INSERT IMAGE CONTENT HERE] bằng nội dung hình ảnh cụ thể dựa trên kịch bản sau: "${sceneDescription}".
Trả về JSON array: [ { "english": "FULL_PROMPT_STRING_WITH_TEMPLATE", "vietnamese": "Mô tả ngắn gọn cảnh bằng tiếng Việt" } ].`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.visual.bulk', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý tạo prompt hình ảnh hàng loạt. Luôn trả JSON array.',
        },
        {
          role: 'user',
          content: `NHIỆM VỤ: Tạo prompts hình ảnh cho toàn bộ kịch bản.
PHONG CÁCH: professional financial aesthetic.
CẤU TRÚC: ${FINANCE_VISUAL_TEMPLATE.replace('[INSERT IMAGE CONTENT HERE]', '{image_content}')}
JSON array: { scene: "Đoạn kịch bản", english: "Prompt đầy đủ", vietnamese: "Dịch nghĩa" }.
KỊCH BẢN:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.scenes.summarize', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là trợ lý phân tích kịch bản thành các cảnh quay. Luôn trả về JSON array ScriptPartSummary.',
        },
        {
          role: 'user',
          content: `NHIỆM VỤ: Phân tích kịch bản thành các cảnh quay chi tiết.
PHONG CÁCH HÌNH ẢNH: professional financial aesthetic.
BẮT BUỘC SỬ DỤNG MẪU PROMPT NÀY cho trường 'imagePrompt':
${FINANCE_VISUAL_TEMPLATE}
(Thay thế [INSERT IMAGE CONTENT HERE] bằng nội dung mô tả cụ thể cho từng cảnh)

YÊU CẦU ĐỊNH DẠNG: Trả về một mảng JSON các đối tượng ScriptPartSummary.
Cấu trúc mỗi ScriptPartSummary:
{
    "partTitle": "Tên phần",
    "scenes": [
        {
            "sceneNumber": 1,
            "summary": "Tóm tắt ngắn gọn nội dung cảnh",
            "imagePrompt": "FULL_PROMPT_STRING_FOLLOWING_TEMPLATE",
            "videoPrompt": "Prompt chưa được tạo."
        }
    ]
}

KỊCH BẢN CẦN PHÂN TÍCH:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.video.single', {
  version: V1,
  build({ scene }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bạn tạo prompt video tiếng Anh chuyên nghiệp về tài chính.',
        },
        {
          role: 'user',
          content: `Tạo video prompt (Tiếng Anh) cho cảnh quay tài chính: "${scene.summary}". Tập trung vào môi trường làm việc chuyên nghiệp, biểu đồ, không gian sáng sủa và năng động.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.score', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia thẩm định nội dung kênh "Chú Que Tài Chính".',
        },
        {
          role: 'user',
          content: `Hãy chấm điểm kịch bản này dựa trên 8 tiêu chí cực kỳ khắt khe:
    1. Có sử dụng câu Slogan "Chú Que Tài Chính" và có cấu trúc 5 phần rõ ràng không?
    2. Có bóc tách chi phí bằng con số cụ thể, tính toán cộng trừ nhân chia rõ ràng không?
    3. Có nhắc đến Chi phí cơ hội hoặc Tâm lý học hành vi (ảo giác doanh thu, chi phí chìm...) không?
    4. Không nói lý thuyết suông, giải pháp có thực tiễn (step-by-step) không?
    5. CTA có đặt câu hỏi thực tế để khơi gợi bình luận không?
    6. Có tạo một nhân vật cụ thể (Tên + Tuổi + Mức lương) để kể chuyện không?
    7. Có sử dụng kỹ thuật Bẻ gãy phản biện "Tôi không nói... Tôi đang nói..." không?
    8. Có sử dụng Ẩn dụ vật lý (vd: xô thủng) và kết thúc bằng Tục ngữ/Thành ngữ Việt Nam không?

KỊCH BẢN:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.style.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn gợi ý Expression và Style cho kênh "Chú Que Tài Chính". Luôn trả JSON.',
        },
        {
          role: 'user',
          content: `Gợi ý Expression và Style phù hợp với kênh "Chú Que Tài Chính" cho chủ đề: "${title}". JSON: { "expression": "...", "style": "..." }`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.topics.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn gợi ý ý tưởng video YouTube tài chính cá nhân. Luôn trả JSON array.',
        },
        {
          role: 'user',
          content: `Gợi ý 5 ý tưởng video YouTube về Tài chính cá nhân cho kênh "Chú Que Tài Chính". Bắt buộc tạo Tiêu đề kích thích click chuột bằng 1 trong các công thức:
    1. Sự Thật Về [Chủ đề]: Tại Sao [Nỗ lực] Vẫn Thất bại?
    2. [Lựa chọn A] Hay [Lựa chọn B]? Tôi Đã Tính Ra Con Số Thật.
    3. [Ngành nghề] 2026: Cơ Hội Đổi Đời Hay Cái Bẫy?
    Chủ đề tham khảo: "${title}".
    Trả về định dạng JSON: [{ "title": "Tiêu đề", "outline": "Dàn ý ngắn" }].`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.keywords.suggest', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bạn gợi ý từ khóa SEO cho video tài chính cá nhân.',
        },
        {
          role: 'user',
          content: `Gợi ý 10 từ khóa SEO (ưu tiên tiếng Việt) cho video tài chính cá nhân kênh "Chú Que Tài Chính": "${title}".`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.ideas.fromFile', {
  version: V1,
  build({ content }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bạn trích xuất ý tưởng video tài chính cá nhân. Luôn trả JSON array.',
        },
        {
          role: 'user',
          content: `Trích xuất ý tưởng video tài chính cá nhân từ nội dung file. JSON: { title, outline }.\n\nNỘI DUNG:\n${content}`,
        },
      ],
    };
  },
});
