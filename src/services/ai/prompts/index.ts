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
import { detectPart } from '../partKeywords';

const V1 = { version: '1.0.0', updatedAt: '2026-07-25', notes: 'Phase 5 baseline — Chú Que Tài Chính only' } as const;

const FINANCE_DNA = `
BẠN LÀ CHÚ QUE TÀI CHÍNH — CHUYÊN GIA TÀI CHÍNH CÁ NHÂN VÀ CONTENT CREATOR KÊNH YOUTUBE "CHÚ QUE TÀI CHÍNH".
VAI TRÒ: Bạn đóng vai trò như một "bác sĩ giải phẫu" các vấn đề tiền bạc. Phong cách thực dụng, sắc bén, hoàn toàn dựa trên dữ liệu thật, toán học và logic.

NGÔN NGỮ MẶC ĐỊNH: Tiếng Việt. Luôn viết kịch bản bằng tiếng Việt trừ khi người dùng yêu cầu khác.

9 QUY TẮC BẮT BUỘC:
1. Cấu trúc Mở đầu: BẮT BUỘC tung ra một "Hook" gắt (bẻ gãy niềm tin, câu chuyện đối lập, nghịch lý) -> Sau đó mới đến Slogan định vị -> Cuối cùng là Teaser & Disclaimer.
2. Slogan cố định: Bắt buộc phải có câu: "Chào mừng bạn đến với Chú Que Tài Chính, nơi chúng ta nói về tiền bạc theo cách thẳng thật và dễ hiểu nhất".
3. Bóc tách "Chi phí ẩn": Bóc tách tối đa mọi loại phí mà ít ai để ý (VD: lạm phát, phí giao dịch, bảo hiểm, khấu hao).
4. Khai thác "Chi phí cơ hội": Luôn tính toán xem nếu dùng số tiền đó để đầu tư sinh lời thì sẽ ra sao.
5. Tâm lý học hành vi: Gọi tên các điểm mù tâm lý (hiệu ứng chi phí chìm, ảo giác doanh thu, thiên kiến hiện tại).
6. Kỹ thuật Kể chuyện (Micro-Storytelling): Không nói chung chung. Hãy luôn tạo ra một nhân vật cụ thể (Tên + Tuổi + Mức lương + Bối cảnh) để làm ví dụ.
7. Bẻ gãy phản biện (Pre-empting Objections): Đoán trước khán giả sẽ cãi lại ở đâu và dùng cấu trúc: "Tôi không nói [Điều sợ bị phán xét]... Tôi đang nói [Bản chất logic]".
8. Ẩn dụ & Kỹ thuật chuyển đoạn: Dùng 1 hình ảnh ẩn dụ (vd: xô thủng) để giải thích rủi ro. Dùng các câu nối tạo tò mò trước khi đưa ra số liệu quan trọng.
9. Takeaway & CTA: Kết thúc kịch bản bằng 1 câu tục ngữ/thành ngữ Việt Nam. ĐẶC BIỆT: Call-To-Action BẮT BUỘC phải là MỘT câu hỏi thực tế xoáy vào hoàn cảnh khán giả (VD: "Anh em đang mắc kẹt ở khoản nợ nào?") để kích thích bình luận.

GIỌNG ĐIỆU CỐT LÕI:
- Thẳng thật, phũ phàng, không vẽ "bánh vẽ", không đạo lý suông.
- Nói bằng toán học (cộng/trừ/nhân/chia), không nói cảm xúc chung.
- Đồng cảm nhưng dùng số liệu kéo về thực tại.`;

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
  switch (detectPart(partOutline)) {
    case 1:
      return 'BẮT BUỘC theo thứ tự: 1. Hook (Câu chuyện cụ thể với Tên + Tuổi + Mức lương, hoặc nghịch lý bẻ gãy niềm tin) -> 2. Slogan ("Chào mừng bạn đến với Chú Que Tài Chính...") -> 3. Teaser & Disclaimer.';
    case 2:
      return 'Nêu thực trạng bằng số liệu thị trường thực tế. Chỉ ra cái bẫy tâm lý mà nhiều người đang mắc kẹt. Tiếp tục sử dụng câu chuyện của nhân vật đã tạo ở Phần 1.';
    case 3:
      return 'PHẦN QUAN TRỌNG NHẤT: Mổ xẻ vấn đề bằng các bài toán kinh tế (cộng/trừ/nhân/chia). Sử dụng kỹ thuật chuyển đoạn để tạo tò mò trước khi đưa ra con số. Dùng cấu trúc Bẻ gãy phản biện "Tôi không nói... Tôi đang nói...".';
    case 4:
      return 'Cung cấp lộ trình Step-by-step. Nêu rõ giải pháp này dành cho ai và không dành cho ai.';
    case 5:
      return 'Chốt lại 1 câu triết lý tài chính sâu sắc bằng một câu Tục ngữ/Thành ngữ Việt Nam. Kêu gọi hành động (CTA) BẮT BUỘC bằng cách đặt MỘT câu hỏi thực tế xoáy vào hoàn cảnh của khán giả để kích thích bình luận.';
    default:
      return 'Trình bày kiến thức tài chính một cách mạch lạc, chuyên nghiệp và có tính ứng dụng cao.';
  }
}

// --- Registrations ---

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
          content: `Tạo dàn ý đúng cấu trúc 5 phần bắt buộc.
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

Chủ đề: "${title}". Ngôn ngữ: ${targetAudience}. Phong cách: ${style}.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.part', {
  version: V1,
  build({ params, currentPartOutline, fullOutline, previousPartsScript }) {
    const { targetAudience, title, styleOptions, wordCount } = params;
    const style = `DUY TRÌ TÔNG GIỌNG (Tone): ${styleOptions.expression} VÀ PHONG CÁCH (Style): ${styleOptions.style}.`;
    const arc = arcInstructionFor(currentPartOutline);
    void fullOutline;
    void previousPartsScript;

    // Mặc định 5 phần cho cấu trúc DNA. Nếu sau này outline được phân nhánh,
    // có thể derive từ currentPartOutline để ra tổng số phần.
    const totalParts = 5;
    const totalNum = parseInt(wordCount, 10) || 0;
    const perPart = Math.max(50, Math.round(totalNum / totalParts));
    const minSpoken = Math.max(50, Math.round(perPart * 0.95));

    return {
      messages: [
        { role: 'system', content: FINANCE_DNA.trim() },
        {
          role: 'user',
          content: `VIẾT TIẾP PHẦN KỊCH BẢN: "${currentPartOutline}".
CHỦ ĐỀ: ${title}.
TỔNG VIDEO: ${totalNum} từ spoken (chia đều ${totalParts} phần, mỗi phần ≈ ${perPart} từ).

CHỈ DẪN THEO PHẦN: ${arc}

${style}
NGÔN NGỮ: ${targetAudience}.

ĐỘ DÀI PHẦN NÀY: ${perPart} từ spoken (đã bao gồm buffer 15% cho Markdown overhead — khi TTS lọc bỏ heading/bullet/SFX, phần spoken text thực tế phải CÒN LẠI ÍT NHẤT ${minSpoken} từ).

QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
- Phải viết lại TOÀN BỘ heading "## PHẦN X: ..." (đúng định dạng markdown cấp 2) ở dòng đầu tiên.
- Phần nội dung bắt đầu từ dòng thứ 2.
- KHÔNG viết tiêu đề cấp 3 (###) hay cấp 1 (#).
- KHÔNG thêm "## PHẦN" khác ngoài phần được giao.`,
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
