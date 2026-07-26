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

const V1 = { version: '1.0.1', updatedAt: '2026-07-26', notes: 'Phase 6: No Hallucination & Multi-dimensional Analysis' } as const;

// --- Dữ liệu DNA từ file nhánh ---
import coreRaw from '../../../../docs/dna/finance-core.md?raw';
import analyticalRaw from '../../../../docs/dna/finance-analytical.md?raw';
import psychologyRaw from '../../../../docs/dna/finance-psychology.md?raw';
import mythbustingRaw from '../../../../docs/dna/finance-mythbusting.md?raw';
import listicleRaw from '../../../../docs/dna/finance-listicle.md?raw';
import fundamentalRaw from '../../../../docs/dna/finance-fundamental.md?raw';
import hooksRaw from '../../../../docs/dna/finance-hooks.md?raw';

function getBranchDna(branch?: string): string {
  switch (branch) {
    case 'analytical': return analyticalRaw;
    case 'psychology': return psychologyRaw;
    case 'mythbusting': return mythbustingRaw;
    case 'listicle': return listicleRaw;
    case 'fundamental': return fundamentalRaw;
    default: return analyticalRaw;
  }
}

function getHookDna(hook?: string): string {
  return `${hooksRaw}\n\n[LỆNH BẮT BUỘC TỪ HỆ THỐNG]: Trong kịch bản này, BẮT BUỘC sử dụng kiểu mở đầu (Hook): "${hook || 'story'}". TUYỆT ĐỐI không dùng kiểu khác.`;
}

function buildFinanceSystemPrompt(branch?: string, hook?: string, macroContext?: string): string {
  const parts = [
    `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]`,
    coreRaw,
    getBranchDna(branch),
    getHookDna(hook)
  ];
  if (macroContext) {
    parts.push(`[DỮ LIỆU VĨ MÔ THỰC TẾ TRÊN THỊ TRƯỜNG - DO HỆ THỐNG CUNG CẤP]:\n${macroContext}\n\nHãy lấy dữ liệu thật này làm cơ sở, tuyệt đối không bịa số liệu.`);
  }
  return parts.join('\n\n');
}

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
      return 'Tạo Hook thu hút (bằng câu chuyện hoặc nghịch lý) -> Giới thiệu Slogan ("Chào mừng bạn đến với Chú Que Tài Chính...") một cách tự nhiên -> Nêu vấn đề chính của video.';
    case 2:
      return 'Nêu thực trạng thị trường hoặc bẫy tâm lý. Sử dụng câu chuyện nhân vật làm ví dụ để khán giả dễ đồng cảm.';
    case 3:
      return 'PHẦN QUAN TRỌNG NHẤT: Phân tích vấn đề bằng các con số thực tế. Nhắc lại: CHỈ so sánh các con số cuối cùng một cách dễ hiểu, KHÔNG trình bày công thức toán học dài dòng. BẮT BUỘC sử dụng ít nhất 1 hình ảnh ẩn dụ vật lý quen thuộc (như cái xô thủng, máy chạy bộ) để minh họa cho tình trạng tài chính. Đừng quên dùng cấu trúc "Tôi không nói... Tôi đang nói..." để rào trước phản biện.';
    case 4:
      return 'Cung cấp lộ trình hành động (Step-by-step) rõ ràng, thực tế. Phân loại rõ giải pháp này hợp với ai, không hợp với ai.';
    case 5:
      return 'Đưa ra một đúc kết/triết lý tài chính sâu sắc. BẮT BUỘC chốt lại bằng 1 câu Thành ngữ/Tục ngữ dân gian Việt Nam cho thân thiện. Kết thúc bằng 1 câu hỏi Call-To-Action xoáy vào thực tế khán giả.';
    default:
      return 'Trình bày kiến thức tài chính một cách mạch lạc, chuyên nghiệp và có tính ứng dụng cao.';
  }
}

// --- Registrations ---

promptRegistry.register('finance.router.classify', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content: `Bạn là một AI phân loại chủ đề kịch bản tài chính. Nhiệm vụ của bạn là đọc tiêu đề (title) và quyết định kịch bản nên sử dụng nhánh phân tích (branch) nào và kiểu mở đầu (hook) nào.
          
Nhánh (branch) được phép:
- "analytical": Nếu chủ đề liên quan đến đầu tư, thị trường, con số, công thức, bài toán kinh tế (VD: Lãi suất, BĐS, so sánh 2 phương án).
- "psychology": Nếu chủ đề liên quan đến tâm lý, thói quen tiêu tiền, áp lực đồng trang lứa, cảm xúc (VD: Lương 20 triệu vẫn thiếu, nghiện mua sắm).
- "mythbusting": Nếu chủ đề là những niềm tin sai lầm phổ biến, lừa đảo, hoặc cần bóc phốt (VD: "Thu nhập thụ động là dối trá").
- "listicle": Nếu chủ đề là dạng top/danh sách cụ thể, hành động nhanh (VD: 5 cách tiết kiệm, 3 sai lầm).
- "fundamental": Nếu chủ đề là các kiến thức/kỹ năng nền tảng cơ bản, luật lệ, thuế, bảo hiểm (VD: Thuế TNCN, Kỹ năng bán hàng).

Kiểu mở đầu (hook) được phép:
- "story": Kể một câu chuyện cá nhân/nhân vật (Hợp với psychology).
- "data": Đưa ra một con số gây sốc (Hợp với analytical).
- "myth": Đập tan một lầm tưởng (Hợp với mythbusting).
- "question": Câu hỏi tương tác xoáy vào hoàn cảnh.

BẮT BUỘC TRẢ VỀ DƯỚI DẠNG JSON SCHEMA:
{
  "branch": "analytical" | "psychology" | "mythbusting" | "listicle",
  "hook": "story" | "data" | "myth" | "question"
}`
        },
        {
          role: 'user',
          content: `Chủ đề kịch bản: "${title}"`
        }
      ]
    };
  }
});

promptRegistry.register('finance.data.retrieve', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content: `Bạn là một chuyên gia nghiên cứu kinh tế vĩ mô. 
Nhiệm vụ của bạn là cung cấp một bản tóm tắt siêu ngắn (khoảng 3-4 gạch đầu dòng) về các chỉ số/thực trạng kinh tế vĩ mô mới nhất, bám sát vào chủ đề kịch bản.
Nếu chủ đề không liên quan đến vĩ mô (ví dụ: "cách kiểm soát cảm xúc khi mua sắm"), hãy trả về "Không có biến động vĩ mô liên quan".
ĐỪNG BỊA SỐ LIỆU. Hãy dùng những kiến thức cập nhật nhất bạn có. Nêu rõ bối cảnh (Ví dụ: "Lãi suất Fed đang ở mức...", "Giá vàng thế giới đang dao động quanh...").`
        },
        {
          role: 'user',
          content: `Chủ đề kịch bản: "${title}"`
        }
      ]
    };
  }
});

promptRegistry.register('finance.script.outline', {
  version: V1,
  build({ params }) {
    const { title, outlineContent, targetAudience, styleOptions, wordCount } = params;
    const style = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;
    
    const userRequirements = outlineContent 
      ? `\n\nYÊU CẦU NỘI DUNG TỪ ĐẠO DIỄN (TRỌNG SỐ CAO NHẤT):\n"${outlineContent}"\n-> HƯỚNG DẪN: Lấy "Chủ đề" làm móng, nhưng BẮT BUỘC phải lồng ghép tất cả các ý trong "Yêu cầu nội dung" này vào các phần của Dàn ý sao cho mạch lạc và hợp lý nhất.` 
      : '';

    return {
      messages: [
        { role: 'system', content: buildFinanceSystemPrompt(params.scriptStyle, params.scriptHook, params.macroContext) },
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
- QUY TẮC SỐ LIỆU TỐI THƯỢNG: TUYỆT ĐỐI KHÔNG TỰ BỊA CÁC SỐ LIỆU CỤ THỂ (như giá vàng, lãi suất, tỷ giá của các năm trong quá khứ/hiện tại). Nếu hệ thống không cung cấp trong DỮ LIỆU VĨ MÔ, bắt buộc phải dùng biến số như [CẦN ĐIỀN GIÁ VÀNG NĂM 2004] để người dùng tự điền. Vi phạm quy tắc này là lỗi chết người.

QUY TẮC VỀ ĐỘ DÀI:
- Kịch bản dự kiến dài ${wordCount} từ.
- ĐÂY LÀ DÀN Ý, KHÔNG PHẢI KỊCH BẢN. 
- Mỗi gạch đầu dòng chỉ viết 1-2 câu siêu NGẮN GỌN (từ khóa, ý chính). TUYỆT ĐỐI KHÔNG viết thành đoạn văn dài thòng.

Nội dung từng phần:
- PHẦN 1: Hook thu hút -> Slogan -> Vấn đề chính.
- PHẦN 2: Thực trạng; bẫy tâm lý khán giả đang mắc.
- PHẦN 3: So sánh số liệu (không viết công thức toán); bẻ gãy phản biện.
- PHẦN 4: Lộ trình step-by-step; phân nhóm đối tượng.
- PHẦN 5: Đúc kết/triết lý + 1 câu hỏi xoáy vào khán giả (CTA).

CHỦ ĐỀ CHÍNH: "${title}"
NGÔN NGỮ: ${targetAudience}
PHONG CÁCH: ${style}${userRequirements}`,
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
    // Đếm số lượng phần thực tế trong dàn ý (để chia số từ chính xác)
    const matchParts = fullOutline.match(/## PHẦN \d+/gi);
    const totalParts = matchParts ? Math.max(1, matchParts.length) : 5;
    const totalNum = parseInt(wordCount, 10) || 0;
    const perPart = Math.max(50, Math.round(totalNum / totalParts));
    const minSpoken = Math.max(50, Math.round(perPart * 0.95));

    return {
      messages: [
        { role: 'system', content: buildFinanceSystemPrompt(params.scriptStyle, params.scriptHook, params.macroContext) },
        {
          role: 'user',
          content: `DÀN Ý TỔNG THỂ CỦA VIDEO:
${fullOutline}

KỊCH BẢN CÁC PHẦN TRƯỚC (Để tiếp nối mạch văn. Bỏ qua nếu đây là phần 1):
${previousPartsScript || '(Chưa có)'}

=====================
NHIỆM VỤ: VIẾT TIẾP PHẦN KỊCH BẢN DƯỚI ĐÂY: 
"${currentPartOutline}"

CHỦ ĐỀ: ${title}.
TỔNG VIDEO: ${totalNum} từ spoken (chia đều ${totalParts} phần, mỗi phần ≈ ${perPart} từ).

CHỈ DẪN THEO PHẦN: ${arc}

${style}
NGÔN NGỮ: ${targetAudience}.

ĐỘ DÀI PHẦN NÀY: ${perPart} từ spoken (đã bao gồm buffer 15% cho Markdown overhead — khi TTS lọc bỏ heading/bullet/SFX, phần spoken text thực tế phải CÒN LẠI ÍT NHẤT ${minSpoken} từ).

QUY TẮC ĐỊNH DẠNG TỐI THƯỢNG (Bắt buộc tuân thủ 100%):
1. TRẢ VỀ TRỰC TIẾP NỘI DUNG KỊCH BẢN. TUYỆT ĐỐI KHÔNG giải thích, KHÔNG dạo đầu, KHÔNG suy luận.
2. BẮT ĐẦU NGAY văn bản bằng TOÀN BỘ heading "## PHẦN X: ..." (đúng định dạng markdown cấp 2). Các nội dung tiếp theo bắt đầu từ dòng thứ 2.
3. KHÔNG viết tiêu đề cấp 3 (###) hay cấp 1 (#). KHÔNG thêm "## PHẦN" khác ngoài phần được giao.
4. VĂN XUÔI CHUYÊN NGHIỆP: Tuyệt đối KHÔNG dùng gạch đầu dòng (-) hoặc đánh số (1. 2. 3.). Phải viết thành các đoạn văn liên tục (Paragraphs). Đan xen các câu siêu ngắn (3-5 chữ) để tạo điểm nhấn.
5. GIAO TIẾP GẦN GŨI: Luôn xưng "Tôi" và gọi khán giả là "Anh em" hoặc "Bạn". KHÔNG dùng từ nối khô khan (Đầu tiên là, Tóm lại). Hãy dùng: "Anh em thử nghĩ mà xem...", "Nói thật với anh em...".
6. SẮC BÉN DỮ LIỆU: Phải giữ nguyên 100% các con số đã chốt trong Dàn Ý. KHÔNG bịa số liệu mới. Hãy phân tích cặn kẽ từng ý, tuyệt đối không viết tóm tắt hời hợt.`,
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
        { role: 'system', content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\n` + coreRaw.trim() },
        {
          role: 'user',
          content: `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}".\n${financeGuard}\n${styleLine}\n\nKịch bản gốc:\n${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.revise.partial', {
  version: V1,
  build({ script, revisionPrompt, style }) {
    const styleLine = style
      ? `Giữ vững Tone: ${style.expression} và Style: ${style.style}.`
      : '';
    const financeGuard =
      'LƯU Ý: Giữ vững triết lý cung cấp kiến thức tài chính thực tế và chuyên nghiệp. Không thêm yếu tố giật gân, kinh dị hay clickbait.';
    return {
      messages: [
        { role: 'system', content: `[BỐI CẢNH THỜI GIAN: Năm hiện tại là ${new Date().getFullYear()}]\n\nBạn là Script Doctor của kênh "Chú Que Tài Chính". Nhiệm vụ của bạn là sửa kịch bản dựa trên các feedback cụ thể. ${financeGuard}\n\n` + coreRaw.trim() },
        {
          role: 'user',
          content: `KỊCH BẢN GỐC:\n${script}\n\nYÊU CẦU CHỈNH SỬA:\n${revisionPrompt}\n${styleLine}\n\nNHIỆM VỤ QUAN TRỌNG:
Thay vì viết lại toàn bộ kịch bản, bạn HÃY CHỈ SỬA NHỮNG ĐOẠN CẦN THIẾT để tiết kiệm thời gian và không làm hỏng dòng chảy văn bản cũ.
Bạn phải trả về định dạng JSON chứa mảng các đoạn cần thay thế:
\`\`\`json
{
  "replacements": [
    {
      "original_text_snippet": "Trích đoạn ngắn (khoảng 2-5 câu) từ kịch bản gốc cần được thay thế. TRÍCH XUẤT CHÍNH XÁC TỪNG CHỮ 100%.",
      "new_text": "Đoạn văn mới đã được sửa theo feedback để thay thế cho trích đoạn trên."
    }
  ]
}
\`\`\`
Lưu ý: Chỉ trả về JSON, không giải thích gì thêm.`
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
            'Bạn là một "Script Doctor" và biên tập viên khắt khe của kênh "Chú Que Tài Chính".\n\n' +
            'MỤC TIÊU CỦA BẠN: Chấm điểm kịch bản không nhân nhượng. Không khen ngợi chung chung. Không cộng điểm vì nỗ lực.\n' +
            'Điểm 9-10 cực hiếm. Điểm 8 là Tốt. Điểm 7 là Khá. Dưới 6 là nhiều vấn đề.\n\n' +
            'BẠN LUÔN PHẢI TRẢ VỀ DẠNG JSON.\n\n' + coreRaw.trim(),
        },
        {
          role: 'user',
          content: `Hãy nhận xét và chấm điểm kịch bản này dựa trên 5 tiêu chí. 
Mỗi tiêu chí cho điểm từ 1-10, đi kèm lời phê (analysis) và dẫn chứng cụ thể từ kịch bản (evidence).

5 TIÊU CHÍ (Dành riêng cho Tài Chính Cá Nhân):
1. Kết cấu và mạch cảm xúc (structure): Mở đầu có đánh trúng nỗi đau tài chính thực tế? Chuyển ý giữa các bài toán tiền bạc có mượt không? Kết thúc có đúc kết bài học đắt giá và câu chào chuẩn kênh?
2. Tính thực chiến & Số liệu (research): Các con số (lãi suất, lương, giá nhà) có thực tế với Việt Nam không? Có cảnh báo rủi ro không? Có bị sa đà vào lý thuyết suông hay hứa hẹn làm giàu nhanh (lỗi nặng)?
3. Giọng văn & Phong cách (voice): Xưng hô "Tôi - anh em" có tự nhiên? Văn phong có sắc lạnh, thẳng thắn, "không bán mơ", ít dùng thuật ngữ học thuật (gatekeeping) nhưng vẫn thấu cảm?
4. Tư duy & Chiều sâu (insight): Có bóc trần được tâm lý hành vi (FOMO, bẫy tiêu dùng)? Có phá vỡ định kiến tài chính cũ kỹ (Myth-busting) hay chỉ khuyên "hãy tiết kiệm" chung chung?
5. Nhịp điệu thu âm (cinematic): Cấu trúc câu dài/ngắn có đan xen để tạo điểm nhấn âm thanh khi đọc? Có ngắt quãng hợp lý (khoảng nghỉ) để khán giả ngấm số liệu? Không viết câu dài lê thê đều đều.

QUY TẮC TRỪ ĐIỂM (Penalties):
- Trừ 0.2-0.5: Lặp ý, lặp từ, chuyển đoạn gượng.
- Trừ 0.5-1.0: Thiếu dẫn chứng, logic yếu, kết quá nhanh.
- Trừ 1.0-2.0: Sai dữ kiện, cảm xúc giả tạo, kể lan man.
Nếu có lỗi, hãy thêm vào mảng penalties (deduction là số dương, ví dụ 0.5).

BẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON SCHEMA SAU:
{
  "criteria": {
    "structure": { "score": 8.5, "analysis": "...", "evidence": "Trích dẫn..." },
    "research": { "score": 8.0, "analysis": "...", "evidence": "..." },
    "voice": { "score": 9.0, "analysis": "...", "evidence": "..." },
    "insight": { "score": 7.5, "analysis": "...", "evidence": "..." },
    "cinematic": { "score": 8.0, "analysis": "...", "evidence": "..." }
  },
  "penalties": [
    { "reason": "Chuyển đoạn gượng ở phần giữa", "deduction": 0.5 }
  ],
  "pros": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "cons": ["Điểm cần cải thiện 1", "Điểm cần cải thiện 2"],
  "overallReview": "Nhận xét tổng quan và gợi ý cải thiện...",
  "estimatedTime": "Khoảng 8 phút 30 giây (ước tính)"
}

KỊCH BẢN:
${script}`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.score.outline', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        {
          role: 'system',
          content:
            'Bạn là chuyên gia thẩm định Dàn Ý video tài chính cá nhân. Bạn đánh giá mức độ logic, cấu trúc và tính thu hút của các ý tưởng trong Dàn Ý. Bắt buộc trả về JSON. KHÔNG phạt Dàn Ý vì sử dụng gạch đầu dòng (bullet points) hay listicle, vì đây là Dàn Ý chứ không phải Kịch bản chi tiết.',
        },
        {
          role: 'user',
          content: `Đánh giá DÀN Ý này dựa trên 5 tiêu chí:
1. Cấu trúc (Structure): Các phần có được phân chia hợp lý không? Đánh giá tính logic của trật tự các luận điểm. (Tuyệt đối không trừ điểm nếu dùng gạch đầu dòng).
2. Dữ liệu & Logic (Research): Dàn ý có vạch ra được các con số hoặc ví dụ thực tế cần có không?
3. Góc nhìn (Voice): Góc nhìn tiếp cận vấn đề có sắc sảo, thực tế và phù hợp với định hướng kênh không?
4. Chiều sâu (Insight): Ý tưởng cốt lõi (Core message) có thực sự đọng lại giá trị không?
5. Tiềm năng thị giác (Cinematic): Dàn ý có gợi ra các hình ảnh, biểu đồ, hay ẩn dụ thị giác nào dễ thực hiện trên video không?

Trả về JSON ĐÚNG cấu trúc sau (điểm /10):
{
  "criteria": {
    "structure": { "score": 8.5, "analysis": "...", "evidence": "..." },
    "research": { "score": 7.0, "analysis": "...", "evidence": "..." },
    "voice": { "score": 9.0, "analysis": "...", "evidence": "..." },
    "insight": { "score": 8.0, "analysis": "...", "evidence": "..." },
    "cinematic": { "score": 6.5, "analysis": "...", "evidence": "..." }
  },
  "penalties": [],
  "pros": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "cons": ["Điểm cần cải thiện 1", "Điểm cần cải thiện 2"],
  "overallReview": "Nhận xét tổng quan về tính khả thi của ý tưởng...",
  "estimatedTime": "N/A"
}

DÀN Ý:
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

promptRegistry.register('finance.data.planner', {
  version: V1,
  build({ title }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bạn là chuyên gia phân tích dữ liệu vĩ mô. Hãy lập kế hoạch tìm kiếm thông tin.',
        },
        {
          role: 'user',
          content: `Để viết kịch bản tài chính cho chủ đề: "${title}", hãy liệt kê đúng 3 câu lệnh tìm kiếm Google cực kỳ cụ thể để lấy số liệu thực tế (ví dụ: lãi suất, lịch sử giá cả, biến động thị trường, giá vàng 2004, 2026).
Trả về JSON array chứa 3 string. Ví dụ: ["Giá vàng SJC hôm nay 2026", "Lãi suất tiết kiệm Vietcombank 2026", "Lịch sử giá vàng Việt Nam 2004"].
CHỈ TRẢ VỀ JSON ARRAY, không giải thích.`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.factcheck', {
  version: V1,
  build({ outline, macroContext }) {
    return {
      messages: [
        {
          role: 'system',
          content: 'Bạn là TỔNG BIÊN TẬP KIỂM DUYỆT SỐ LIỆU (Fact-Checker). Nhiệm vụ của bạn là soi lỗi số liệu bịa đặt trong dàn ý.',
        },
        {
          role: 'user',
          content: `Đây là dàn ý kịch bản được viết bởi một AI khác:
<outline>
${outline}
</outline>

Đây là DỮ LIỆU VĨ MÔ CHÍNH XÁC mà hệ thống cung cấp (nếu có):
<macro>
${macroContext || 'Không có dữ liệu vĩ mô nào được cung cấp.'}
</macro>

YÊU CẦU KIỂM DUYỆT (FACT-CHECKING):
1. Quét toàn bộ dàn ý trên. Tìm các con số cụ thể (giá tiền, lãi suất, tỷ giá, năm) mà AI tự ý đưa vào.
2. Nếu các con số đó mâu thuẫn với <macro>, hoặc AI tự bịa số liệu lịch sử (VD: tự cho giá vàng 2004 là 10 triệu) mà không có cơ sở, HÃY GẠCH BỎ CHÚNG.
3. Thay thế các số liệu bịa đặt bằng biến số cần điền, ví dụ: [CẦN ĐIỀN CHÍNH XÁC GIÁ VÀNG NĂM 2004]. Hoặc nếu bạn biết CHẮC CHẮN con số thực tế (và phù hợp với bối cảnh năm hiện tại), bạn có thể sửa lại cho đúng.
4. KHÔNG làm thay đổi cấu trúc Heading của dàn ý (vẫn giữ nguyên 5 PHẦN).
5. TRẢ VỀ DÀN Ý ĐÃ ĐƯỢC THANH LỌC, KHÔNG GIẢI THÍCH DÀI DÒNG. Bắt đầu ngay bằng "## PHẦN 1...".`,
        },
      ],
    };
  },
});

promptRegistry.register('finance.script.resolve.search', {
  version: V1,
  build({ script, searchData }) {
    return {
      messages: [
        { role: 'system', content: `Bạn là trợ lý biên tập. Nhiệm vụ của bạn là giải quyết các biến số [CẦN ĐIỀN...] trong kịch bản bằng dữ liệu thực tế.` },
        { role: 'user', content: `DỮ LIỆU TÌM KIẾM ĐƯỢC:\n${searchData}\n\nYÊU CẦU: Hãy duyệt qua toàn bộ Dàn ý sau và tìm các thẻ [CẦN ĐIỀN...]. Hãy thay thế các thẻ đó bằng số liệu tương ứng từ Dữ liệu tìm kiếm được.\nNếu dữ liệu tìm kiếm KHÔNG CÓ con số đó, giá trị thay thế phải là chính thẻ đó hoặc ghi rõ [TÌM KIẾM THẤT BẠI: thẻ cũ]. Tuyệt đối KHÔNG tự ước tính.\n\nBẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON OBJECT:\n- KEY là toàn bộ chuỗi thẻ cũ (ví dụ: "[CẦN ĐIỀN Giá vàng]").\n- VALUE là chuỗi mới để thay thế.\n\nVí dụ: { "[CẦN ĐIỀN Giá vàng năm 2004]": "7 triệu VNĐ", "[CẦN ĐIỀN Lãi suất]": "[TÌM KIẾM THẤT BẠI: Lãi suất]" }\n\nTUYỆT ĐỐI KHÔNG TRẢ VỀ TOÀN BỘ DÀN Ý, CHỈ TRẢ VỀ ĐÚNG 1 ĐỐI TƯỢNG JSON.\n\nDÀN Ý GỐC:\n${script}` },
      ],
    };
  },
});

promptRegistry.register('finance.script.resolve.estimate', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        { role: 'system', content: `Bạn là trợ lý biên tập am hiểu kinh tế.` },
        { role: 'user', content: `YÊU CẦU: Hãy duyệt qua Dàn ý sau. Với mỗi thẻ [CẦN ĐIỀN...], hãy TỰ ƯỚC TÍNH một con số/giá trị hợp lý nhất có thể, và bọc bằng thẻ [KIỂM TRA LẠI: <số liệu ước tính của bạn>].\n\nBẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON OBJECT:\n- KEY là toàn bộ chuỗi thẻ cũ (ví dụ: "[CẦN ĐIỀN Giá vàng]").\n- VALUE là chuỗi ước tính mới (ví dụ: "[KIỂM TRA LẠI: khoảng 7 triệu]").\n\nTUYỆT ĐỐI KHÔNG TRẢ VỀ TOÀN BỘ DÀN Ý, CHỈ TRẢ VỀ ĐÚNG 1 ĐỐI TƯỢNG JSON.\n\nDÀN Ý GỐC:\n${script}` },
      ],
    };
  },
});

promptRegistry.register('finance.script.resolve.simplify', {
  version: V1,
  build({ script }) {
    return {
      messages: [
        { role: 'system', content: `Bạn là trợ lý biên tập.` },
        { role: 'user', content: `YÊU CẦU: Hãy duyệt qua Dàn ý sau. Có một số thẻ [CẦN ĐIỀN...] yêu cầu dữ liệu phức tạp. Hãy thay thế thẻ này bằng một cụm từ định tính chung chung (ví dụ: đổi thành "cao hơn lạm phát rất nhiều" hoặc "rất đắt đỏ").\n\nBẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON OBJECT:\n- KEY là toàn bộ chuỗi thẻ cũ.\n- VALUE là cụm từ đơn giản hóa.\n\nTUYỆT ĐỐI KHÔNG TRẢ VỀ TOÀN BỘ DÀN Ý, CHỈ TRẢ VỀ ĐÚNG 1 ĐỐI TƯỢNG JSON.\n\nDÀN Ý GỐC:\n${script}` },
      ],
    };
  },
});
