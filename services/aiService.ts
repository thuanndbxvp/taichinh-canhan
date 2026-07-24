import type { GenerationParams, VisualPrompt, AllVisualPromptsResult, ScriptPartSummary, StyleOptions, TopicSuggestionItem, AiProvider, SummarizeConfig, SceneSummary } from '../types';
import { apiKeyManager } from './apiKeyManager';
import { AppError } from '../src/lib/errors';
import { cleanJsonResponse, tryParseJson } from '../src/lib/json';
import { aiRequest } from '../src/lib/aiRequest';

const DEFAULT_TIMEOUT_MS = 120_000;

const handleApiError = (error: unknown, action: string): AppError => {
    if (error instanceof AppError) {
        console.error(`[aiService] ${action} (${error.code}):`, error.message);
        return error;
    }
    if (error instanceof Error) {
        console.error(`[aiService] ${action}:`, error);
        return AppError.from('AI_PROVIDER_FAILED', error.message, { action }, error);
    }
    console.error(`[aiService] ${action}:`, error);
    return AppError.from('AI_PROVIDER_FAILED', `Lỗi khi ${action}`, { action }, error);
};

const PROVIDER_ENDPOINTS: Record<AiProvider, (model: string, apiKey: string, body: unknown, signal?: AbortSignal) => Promise<string>> = {
    kyma: async (model, apiKey, body, signal) => {
        const res = await aiRequest<{ choices?: { message?: { content?: string } }[] }>(
            'https://kymaapi.com/v1/chat/completions',
            {
                provider: 'kyma',
                action: 'chat',
                body,
                headers: { Authorization: `Bearer ${apiKey}` },
                signal,
                timeoutMs: DEFAULT_TIMEOUT_MS,
            },
        );
        return res.data.choices?.[0]?.message?.content ?? '';
    },
    openai: async (model, apiKey, body, signal) => {
        const baseUrl = (typeof localStorage !== 'undefined' && localStorage.getItem('openai-base-url')) || 'https://api.openai.com/v1';
        const res = await aiRequest<{ choices?: { message?: { content?: string } }[] }>(
            `${baseUrl}/chat/completions`,
            {
                provider: 'openai',
                action: 'chat',
                body,
                headers: { Authorization: `Bearer ${apiKey}` },
                signal,
                timeoutMs: DEFAULT_TIMEOUT_MS,
            },
        );
        return res.data.choices?.[0]?.message?.content ?? '';
    },
};

const callApi = async (
    prompt: string,
    provider: AiProvider,
    model: string,
    options?: { signal?: AbortSignal },
): Promise<string> => {
    const { apiKey, releaseKey } = await apiKeyManager.getAvailableKey(provider);
    try {
        const endpoint = PROVIDER_ENDPOINTS[provider];
        if (!endpoint) {
            throw AppError.from('VALIDATION_FAILED', `Provider ${provider} không được hỗ trợ`, { provider });
        }
        return await endpoint(model, apiKey, {
            model,
            messages: [{ role: 'user', content: prompt }],
        }, options?.signal);
    } catch (err) {
        if (err instanceof AppError) {
            if (err.meta.status === 401 || err.meta.status === 403 || err.code === 'AI_KEY_INVALID') {
                apiKeyManager.reportInvalidKey(provider, apiKey);
            }
            throw err;
        }
        throw handleApiError(err, `gọi ${provider}`);
    } finally {
        releaseKey();
    }
};

export const validateApiKey = async (key: string, provider: AiProvider): Promise<boolean> => {
    if (provider === 'kyma') {
        try {
            const res = await fetch('https://kymaapi.com/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
            return res.ok;
        } catch (e) {
            throw new Error('Kyma API Key không hợp lệ.');
        }
    }
    if (provider === 'openai') {
        try {
            const baseUrl = localStorage.getItem('openai-base-url') || 'https://api.openai.com/v1';
            const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
            return res.ok;
        } catch {
            return false;
        }
    }
    return false;
};

// --- FINANCE DNA (Chú Que Tài Chính) ---
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

const styleInstruction = (styleOptions: StyleOptions): string => `
YÊU CẦU VỀ PHONG CÁCH VÀ LỐI DIỄN ĐẠT (TUÂN THỦ TUYỆT ĐỐI):
- Tone (Tông giọng): ${styleOptions.expression} (Hãy thể hiện rõ nét tông giọng này xuyên suốt kịch bản).
- Style (Phong cách viết): ${styleOptions.style}.`;

export const generateScript = async (params: GenerationParams, provider: AiProvider, model: string): Promise<string> => {
    const { title, targetAudience, wordCount, isFinanceMode, styleOptions } = params;
    const styles = styleInstruction(styleOptions);

    const prompt = isFinanceMode
        ? `${FINANCE_DNA}\nVIẾT KỊCH BẢN TÀI CHÍNH CÁ NHÂN THEO CẤU TRÚC: "${title}". \n${styles}\nNGÔN NGỮ: ${targetAudience}. ĐỘ DÀI: ${wordCount} từ.`
        : `Viết kịch bản YouTube về "${title}".\n${styles}\nNgôn ngữ: ${targetAudience}.\nĐộ dài ước lượng: ${wordCount} từ.\nChia phần rõ ràng bằng tiêu đề ##.\nKỊCH BẢN SẠCH, HẤP DẪN, GIỮ CHÂN NGƯỜI XEM.`;

    try {
        return await callApi(prompt, provider, model);
    } catch (error) {
        throw handleApiError(error, 'tạo kịch bản');
    }
};

export const generateScriptOutline = async (params: GenerationParams, provider: AiProvider, model: string): Promise<string> => {
    const { title, targetAudience, isFinanceMode, styleOptions } = params;
    const style = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;

    const prompt = isFinanceMode
        ? `${FINANCE_DNA}\nTạo dàn ý đúng cấu trúc 5 phần bắt buộc:\n- ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)\n- ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)\n- ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)\n- ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)\n- ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)\nCho chủ đề: "${title}". Ngôn ngữ: ${targetAudience}. Phong cách: ${style}.`
        : `Tạo dàn ý chi tiết cho kịch bản YouTube: "${title}".\nPhong cách & Tông giọng: ${style}.\nNgôn ngữ: ${targetAudience}.\nYêu cầu: Chia thành các phần rõ ràng bắt đầu bằng ##.`;

    try {
        const outline = await callApi(prompt, provider, model);
        return `### Dàn Ý Chi Tiết (Chuẩn bị tạo kịch bản sạch cho TTS)\n\n` + outline;
    } catch (error) {
        throw handleApiError(error, 'tạo dàn ý');
    }
};

export const generateScriptPart = async (
    fullOutline: string,
    previousPartsScript: string,
    currentPartOutline: string,
    params: GenerationParams,
    provider: AiProvider,
    model: string,
): Promise<string> => {
    const { targetAudience, isFinanceMode, title, styleOptions } = params;
    const style = `DUY TRÌ TÔNG GIỌNG (Tone): ${styleOptions.expression} VÀ PHONG CÁCH (Style): ${styleOptions.style}.`;

    let arcInstruction = '';
    if (isFinanceMode) {
        const upperPart = currentPartOutline.toUpperCase();
        if (upperPart.includes('PHẦN 1') || upperPart.includes('MỞ ĐẦU') || upperPart.includes('HOOK')) {
            arcInstruction = 'Bắt buộc chèn Slogan: "Chào mừng bạn đến với Chú Que Tài Chính...". Dùng 1 trong 5 công thức Hook. QUAN TRỌNG: Hãy tạo ra một nhân vật cụ thể (Micro-storytelling với Tên + Tuổi + Mức lương) để dẫn dắt vấn đề.';
        } else if (upperPart.includes('PHẦN 2') || upperPart.includes('BỐI CẢNH') || upperPart.includes('PROBLEM')) {
            arcInstruction = 'Nêu thực trạng bằng số liệu thị trường thực tế. Chỉ ra cái bẫy tâm lý mà nhiều người đang mắc kẹt. Tiếp tục sử dụng câu chuyện của nhân vật đã tạo ở Phần 1.';
        } else if (upperPart.includes('PHẦN 3') || upperPart.includes('GIẢI PHẪU') || upperPart.includes('ANALYSIS')) {
            arcInstruction = 'PHẦN QUAN TRỌNG NHẤT: Bắt buộc mổ xẻ vấn đề bằng các bài toán kinh tế (cộng/trừ/nhân/chia). Sử dụng kỹ thuật Bẻ gãy phản biện "Tôi không nói... Tôi đang nói...". Có thể dùng Ẩn dụ vật lý (vd: cái xô thủng) để minh họa.';
        } else if (upperPart.includes('PHẦN 4') || upperPart.includes('GIẢI PHÁP') || upperPart.includes('ACTIONABLE')) {
            arcInstruction = 'Cung cấp lộ trình Step-by-step. Nêu rõ giải pháp này dành cho ai và không dành cho ai.';
        } else if (upperPart.includes('PHẦN 5') || upperPart.includes('ĐÚC KẾT') || upperPart.includes('TAKEAWAY')) {
            arcInstruction = 'Chốt lại 1 câu triết lý tài chính sâu sắc bằng một câu Tục ngữ/Thành ngữ Việt Nam. Kêu gọi hành động (CTA) bằng cách đặt 1 câu hỏi thực tế xoáy vào hoàn cảnh của khán giả.';
        } else {
            arcInstruction = 'Trình bày kiến thức tài chính một cách mạch lạc, chuyên nghiệp và có tính ứng dụng cao.';
        }
    }

    const prompt = isFinanceMode
        ? `${FINANCE_DNA}\nVIẾT TIẾP PHẦN KỊCH BẢN: "${currentPartOutline}".\nCHỦ ĐỀ: ${title}.\nCHỈ DẪN: ${arcInstruction}\n${style}\nNGÔN NGỮ: ${targetAudience}.\nBẮT BUỘC BẮT ĐẦU BẰNG TIÊU ĐỀ ##.`
        : `Viết tiếp phần kịch bản này dựa trên dàn ý: "${currentPartOutline}".\nChủ đề video: "${title}".\n${style}\nNgôn ngữ: ${targetAudience}.\nBẮT BUỘC bắt đầu bằng tiêu đề ##. Viết nội dung chi tiết, hấp dẫn.`;

    try {
        return await callApi(prompt, provider, model);
    } catch (error) {
        throw handleApiError(error, 'tạo phần kịch bản');
    }
};

export const generateTopicSuggestions = async (title: string, provider: AiProvider, model: string): Promise<TopicSuggestionItem[]> => {
    const prompt = `Gợi ý 5 ý tưởng video YouTube về Tài chính cá nhân cho kênh "Chú Que Tài Chính". Bắt buộc tạo Tiêu đề kích thích click chuột bằng 1 trong các công thức:
    1. Sự Thật Về [Chủ đề]: Tại Sao [Nỗ lực] Vẫn Thất bại?
    2. [Lựa chọn A] Hay [Lựa chọn B]? Tôi Đã Tính Ra Con Số Thật.
    3. [Ngành nghề] 2026: Cơ Hội Đổi Đời Hay Cái Bẫy?
    Chủ đề tham khảo: "${title}".
    Trả về định dạng JSON: [{ "title": "Tiêu đề", "outline": "Dàn ý ngắn" }].`;
    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<TopicSuggestionItem[]>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'gợi ý chủ đề');
    }
};

export const reviseScript = async (
    script: string,
    revisionPrompt: string,
    params: GenerationParams,
    provider: AiProvider,
    model: string,
): Promise<string> => {
    const { isFinanceMode, styleOptions } = params;
    const style = styleOptions ? `Giữ vững Tone: ${styleOptions.expression} và Style: ${styleOptions.style}.` : '';

    const financeGuard = isFinanceMode
        ? 'LƯU Ý: Giữ vững triết lý cung cấp kiến thức tài chính thực tế và chuyên nghiệp. Không thêm yếu tố giật gân, kinh dị hay clickbait.'
        : '';

    const prompt = `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}".\n${financeGuard}\n${style}\n\nKịch bản gốc:\n${script}`;
    try {
        return await callApi(prompt, provider, model);
    } catch (e) {
        throw handleApiError(e, 'sửa kịch bản');
    }
};

export const extractDialogue = async (script: string, provider: AiProvider, model: string): Promise<Record<string, string>> => {
    const prompt = `NHIỆM VỤ: Trích xuất lời thoại SẠCH TUYỆT ĐỐI (Spoken text only) từ kịch bản sau.

QUY TẮC NGHIÊM NGẶT (MUST FOLLOW):
1. LOẠI BỎ TRIỆT ĐỂ:
   - Tất cả các ký hiệu điều hướng như ##, ###, ****, ---, ***.
   - Tất cả tiêu đề phần như "THE HOOK", "**## THE SLOW BURN**".
   - Tất cả các ghi chú kỹ thuật: [SFX], [Scene], Visual:, Audio:, Camera:, SFX:.
   - Tất cả các ghi chú tông giọng hoặc hành động trong ngoặc: (Narrator Voice), (Whispering), (Action), **(Narrator)**.
2. CHỈ GIỮ LẠI: Nội dung văn bản mà con người thực sự ĐỌC THÀNH LỜI trong video.
3. ĐỊNH DẠNG ĐẦU RA: JSON object. Key là tên phần (VD: "Phần 1"), Value là văn bản SẠCH đã xử lý.

KỊCH BẢN CẦN TRÍCH XUẤT:
${script}`;
    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<Record<string, string>>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'tách lời thoại');
    }
};

export const generateKeywordSuggestions = async (title: string, provider: AiProvider, model: string): Promise<string[]> => {
    const prompt = `Gợi ý 10 từ khóa SEO (ưu tiên tiếng Việt) cho video tài chính cá nhân kênh "Chú Que Tài Chính": "${title}".`;
    try {
        const response = await callApi(prompt, provider, model);
        return response.split(',').map((k) => k.trim()).filter(Boolean);
    } catch (e) {
        handleApiError(e, 'gợi ý từ khóa');
        return [];
    }
};

export const generateVisualPrompt = async (sceneDescription: string, provider: AiProvider, model: string): Promise<VisualPrompt[]> => {
    const prompt = `NHIỆM VỤ: Tạo 4 prompt hình ảnh cực kỳ chi tiết cho Midjourney/Leonardo.
PHONG CÁCH BẮT BUỘC: Professional Financial Aesthetic (Chuyên nghiệp, sáng sủa, văn phòng).
MẪU CẤU TRÚC (BẮT BUỘC SỬ DỤNG):
${FINANCE_VISUAL_TEMPLATE}

Hãy thay thế [INSERT IMAGE CONTENT HERE] bằng nội dung hình ảnh cụ thể dựa trên kịch bản sau: "${sceneDescription}".
Trả về JSON array: [ { "english": "FULL_PROMPT_STRING_WITH_TEMPLATE", "vietnamese": "Mô tả ngắn gọn cảnh bằng tiếng Việt" } ].`;

    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<VisualPrompt[]>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'tạo prompt hình ảnh');
    }
};

export const generateAllVisualPrompts = async (script: string, provider: AiProvider, model: string): Promise<AllVisualPromptsResult[]> => {
    const prompt = `NHIỆM VỤ: Tạo prompts hình ảnh cho toàn bộ kịch bản.
PHONG CÁCH: professional financial aesthetic.
CẤU TRÚC: ${FINANCE_VISUAL_TEMPLATE.replace('[INSERT IMAGE CONTENT HERE]', '{image_content}')}
JSON array: { scene: "Đoạn kịch bản", english: "Prompt đầy đủ", vietnamese: "Dịch nghĩa" }.
KỊCH BẢN:
${script}`;
    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<AllVisualPromptsResult[]>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'tạo tất cả prompt');
    }
};

export const summarizeScriptForScenes = async (script: string, config: SummarizeConfig, provider: AiProvider, model: string): Promise<ScriptPartSummary[]> => {
    const prompt = `NHIỆM VỤ: Phân tích kịch bản thành các cảnh quay chi tiết.
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

KỊCH BẢN CẦN PHÂN TÍCH:\n${script}`;

    try {
        const response = await callApi(prompt, provider, model);
        const parsed = JSON.parse(cleanJsonResponse(response));
        if (!Array.isArray(parsed)) {
            throw new Error('Dữ liệu AI trả về không đúng định dạng danh sách (Array).');
        }
        return parsed as ScriptPartSummary[];
    } catch (e) {
        throw handleApiError(e, 'chuyển thể kịch bản (vui lòng thử lại với model mạnh hơn)');
    }
};

export const suggestStyleOptions = async (title: string, provider: AiProvider, model: string): Promise<StyleOptions> => {
    const prompt = `Gợi ý Expression và Style phù hợp với kênh "Chú Que Tài Chính" cho chủ đề: "${title}". JSON: { "expression": "...", "style": "..." }`;
    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<StyleOptions>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'gợi ý phong cách');
    }
};

export const parseIdeasFromFile = async (content: string, provider: AiProvider, model: string): Promise<TopicSuggestionItem[]> => {
    const prompt = `Trích xuất ý tưởng video tài chính cá nhân từ nội dung file. JSON: { title, outline }.`;
    try {
        const response = await callApi(prompt, provider, model);
        const parsed = tryParseJson<TopicSuggestionItem[]>(response);
        if (!parsed) throw new Error('AI trả về không phải JSON hợp lệ.');
        return parsed;
    } catch (e) {
        throw handleApiError(e, 'phân tích file');
    }
};

export const scoreScript = async (script: string, provider: AiProvider, model: string): Promise<string> => {
    const prompt = `Bạn là chuyên gia thẩm định nội dung của kênh "Chú Que Tài Chính". Hãy chấm điểm kịch bản này dựa trên 8 tiêu chí cực kỳ khắt khe:
    1. Có sử dụng câu Slogan "Chú Que Tài Chính" và có cấu trúc 5 phần rõ ràng không?
    2. Có bóc tách chi phí bằng con số cụ thể, tính toán cộng trừ nhân chia rõ ràng không?
    3. Có nhắc đến Chi phí cơ hội hoặc Tâm lý học hành vi (ảo giác doanh thu, chi phí chìm...) không?
    4. Không nói lý thuyết suông, giải pháp có thực tiễn (step-by-step) không?
    5. CTA có đặt câu hỏi thực tế để khơi gợi bình luận không?
    6. Có tạo một nhân vật cụ thể (Tên + Tuổi + Mức lương) để kể chuyện không?
    7. Có sử dụng kỹ thuật Bẻ gãy phản biện "Tôi không nói... Tôi đang nói..." không?
    8. Có sử dụng Ẩn dụ vật lý (vd: xô thủng) và kết thúc bằng Tục ngữ/Thành ngữ Việt Nam không?`;
    try {
        return await callApi(prompt, provider, model);
    } catch (e) {
        throw handleApiError(e, 'chấm điểm kịch bản');
    }
};

export const generateSingleVideoPrompt = async (scene: SceneSummary, config: SummarizeConfig, provider: AiProvider, model: string): Promise<string> => {
    const prompt = `Tạo video prompt (Tiếng Anh) cho cảnh quay tài chính: "${scene.summary}". Tập trung vào môi trường làm việc chuyên nghiệp, biểu đồ, không gian sáng sủa và năng động.`;
    try {
        return await callApi(prompt, provider, model);
    } catch (e) {
        throw handleApiError(e, 'tạo prompt video');
    }
};

export const parseOutlineIntoSegments = (outline: string): string[] => {
    return outline.split(/(?=^## .*?$)/m).filter((s) => s.trim() !== '' && !s.includes('### Dàn Ý'));
};
