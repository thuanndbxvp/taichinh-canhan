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
    const { title, targetAudience, styleOptions, wordCount } = params;
    const style = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;
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
            'Bạn là chuyên gia thẩm định nội dung kênh "Chú Que Tài Chính".\n\n' + coreRaw.trim(),
        },
        {
          role: 'user',
          content: `Hãy nhận xét chi tiết và chấm điểm (thang 10/10) kịch bản này dựa trên triết lý DNA cốt lõi của kênh (sự thực tế, bóc tách con số, tâm lý học hành vi, và ngôn ngữ bình dân).
Chỉ ra rõ những điểm làm tốt và những điểm cần cải thiện.

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
