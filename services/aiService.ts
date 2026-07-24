import type { GenerationParams, VisualPrompt, AllVisualPromptsResult, ScriptPartSummary, StyleOptions, TopicSuggestionItem, AiProvider, Expression, SummarizeConfig, SceneSummary, ScenarioType } from '../types';
import { EXPRESSION_OPTIONS, STYLE_OPTIONS } from '../constants';
import { apiKeyManager } from './apiKeyManager';

/**
 * Helper to extract JSON from AI response that might contain conversational text.
 */
const cleanJsonResponse = (text: string): string => {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    if (jsonMatch) return jsonMatch[1].trim();
    
    const firstBracket = text.indexOf('[');
    const firstBrace = text.indexOf('{');
    const start = (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) ? firstBracket : firstBrace;
    
    const lastBracket = text.lastIndexOf(']');
    const lastBrace = text.lastIndexOf('}');
    const end = Math.max(lastBracket, lastBrace);
    
    if (start !== -1 && end !== -1 && end > start) {
        return text.substring(start, end + 1).trim();
    }
    
    return text.trim();
};

const handleApiError = (error: any, action: string) => {
    console.error(`Error during ${action}:`, error);
    if (error instanceof Error) return error;
    return new Error(`Lỗi khi ${action}: ${error?.message || 'Không xác định'}`);
};

const callApi = async (prompt: string, provider: AiProvider, model: string): Promise<string> => {
    if (provider === 'kyma') {
        const { apiKey, releaseKey } = await apiKeyManager.getAvailableKey('kyma');
        try {
            const res = await fetch('https://kymaapi.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Kyma API Error');
            return data.choices[0].message.content;
        } finally {
            releaseKey();
        }
    } else if (provider === 'openai') {
        const { apiKey, releaseKey } = await apiKeyManager.getAvailableKey('openai');
        try {
            const baseUrl = localStorage.getItem('openai-base-url') || 'https://api.openai.com/v1';
            const res = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'OpenAI API Error');
            return data.choices[0].message.content;
        } finally {
            releaseKey();
        }
    }
    throw new Error(`Provider ${provider} không được hỗ trợ.`);
};

export const validateApiKey = async (key: string, provider: AiProvider): Promise<boolean> => {
    if (provider === 'kyma') {
        try {
            const res = await fetch('https://kymaapi.com/v1/models', { headers: { 'Authorization': `Bearer ${key}` } });
            return res.ok;
        } catch (e) { throw new Error("Kyma API Key không hợp lệ."); }
    } else if (provider === 'openai') {
        try {
            const baseUrl = localStorage.getItem('openai-base-url') || 'https://api.openai.com/v1';
            const res = await fetch(`${baseUrl}/models`, { headers: { 'Authorization': `Bearer ${key}` } });
            return res.ok;
        } catch (e) { return false; }
    }
    return false;
};

// --- FINANCE DNA ---
const FINANCE_DNA = `
BẠN LÀ CHUYÊN GIA TÀI CHÍNH CÁ NHÂN VÀ CONTENT CREATOR.
VAI TRÒ: Bạn đóng vai trò như một "bác sĩ giải phẫu" các vấn đề tiền bạc. Phong cách thực dụng, sắc bén, hoàn toàn dựa trên dữ liệu thật, toán học và logic.

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
- Đồng cảm với nỗi đau nhưng dùng số liệu và logic để kéo khán giả về thực tại.
`;

const FINANCE_VISUAL_TEMPLATE = `Professional financial vector art, modern flat design style.
Clean lines, vibrant colors like green, blue, gold, and white.
Business context, charts, graphs, money, success.
Bright and clear lighting.
Highly professional and trustworthy atmosphere.
No horror elements, no dark themes.
Aspect ratio 16:9.
[INSERT IMAGE CONTENT HERE]`;

export const generateScript = async (params: GenerationParams, provider: AiProvider, model: string): Promise<string> => {
    const { title, targetAudience, wordCount, isFinanceMode, styleOptions } = params;
    
    // Construct style instruction based on user selection
    const styleInstruction = `
    YÊU CẦU VỀ PHONG CÁCH VÀ LỐI DIỄN ĐẠT (TUÂN THỦ TUYỆT ĐỐI):
    - Tone (Tông giọng): ${styleOptions.expression} (Hãy thể hiện rõ nét tông giọng này xuyên suốt kịch bản).
    - Style (Phong cách viết): ${styleOptions.style}.
    `;

    let prompt = isFinanceMode 
        ? `${FINANCE_DNA}\nVIẾT KỊCH BẢN TÀI CHÍNH CÁ NHÂN THEO CẤU TRÚC: "${title}". \n${styleInstruction}\nNGÔN NGỮ: ${targetAudience}. ĐỘ DÀI: ${wordCount} từ.`
        : `Viết kịch bản YouTube về "${title}". 
           ${styleInstruction}
           Ngôn ngữ: ${targetAudience}. 
           Độ dài ước lượng: ${wordCount} từ.
           Chia phần rõ ràng bằng tiêu đề ##. 
           KỊCH BẢN SẠCH, HẤP DẪN, GIỮ CHÂN NGƯỜI XEM.`;
           
    try { return await callApi(prompt, provider, model); } catch (error) { throw handleApiError(error, 'tạo kịch bản'); }
};

export const generateScriptOutline = async (params: GenerationParams, provider: AiProvider, model: string): Promise<string> => {
    const { title, targetAudience, isFinanceMode, styleOptions } = params;
    
    const styleInstruction = `Tone: ${styleOptions.expression}, Style: ${styleOptions.style}`;

    let prompt = isFinanceMode 
        ? `${FINANCE_DNA}\nTạo dàn ý đúng cấu trúc 5 phần bắt buộc:\n- ## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)\n- ## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)\n- ## PHẦN 3: GIẢI PHẪU BẰNG TOÁN HỌC & DỮ LIỆU (ANALYSIS)\n- ## PHẦN 4: GIẢI PHÁP THỰC TẾ (ACTIONABLE STEPS)\n- ## PHẦN 5: ĐÚC KẾT TRIẾT LÝ & KÊU GỌI HÀNH ĐỘNG (TAKEAWAY & CTA)\nCho chủ đề: "${title}". Ngôn ngữ: ${targetAudience}. Phong cách: ${styleInstruction}.` 
        : `Tạo dàn ý chi tiết cho kịch bản YouTube: "${title}".
           Phong cách & Tông giọng: ${styleInstruction}.
           Ngôn ngữ: ${targetAudience}.
           Yêu cầu: Chia thành các phần rõ ràng bắt đầu bằng ##.`;
           
    try {
        const outline = await callApi(prompt, provider, model);
        return `### Dàn Ý Chi Tiết (Chuẩn bị tạo kịch bản sạch cho TTS)\n\n` + outline;
    } catch (error) { throw handleApiError(error, 'tạo dàn ý'); }
};

export const generateScriptPart = async (fullOutline: string, previousPartsScript: string, currentPartOutline: string, params: GenerationParams, provider: AiProvider, model: string): Promise<string> => {
    const { targetAudience, isFinanceMode, title, styleOptions } = params;
    
    const styleInstruction = `DUY TRÌ TÔNG GIỌNG (Tone): ${styleOptions.expression} VÀ PHONG CÁCH (Style): ${styleOptions.style}.`;

    let arcInstruction = "";
    if (isFinanceMode) {
        const upperPart = currentPartOutline.toUpperCase();
        if (upperPart.includes("PHẦN 1") || upperPart.includes("MỞ ĐẦU") || upperPart.includes("HOOK")) {
            arcInstruction = "Bắt buộc chèn Slogan: 'Chào mừng bạn đến với Chú Que Tài Chính...'. Dùng 1 trong 5 công thức Hook. QUAN TRỌNG: Hãy tạo ra một nhân vật cụ thể (Micro-storytelling với Tên + Tuổi + Mức lương) để dẫn dắt vấn đề.";
        } else if (upperPart.includes("PHẦN 2") || upperPart.includes("BỐI CẢNH") || upperPart.includes("PROBLEM")) {
            arcInstruction = "Nêu thực trạng bằng số liệu thị trường thực tế. Chỉ ra cái bẫy tâm lý mà nhiều người đang mắc kẹt. Tiếp tục sử dụng câu chuyện của nhân vật đã tạo ở Phần 1.";
        } else if (upperPart.includes("PHẦN 3") || upperPart.includes("GIẢI PHẪU") || upperPart.includes("ANALYSIS")) {
            arcInstruction = "PHẦN QUAN TRỌNG NHẤT: Bắt buộc mổ xẻ vấn đề bằng các bài toán kinh tế (cộng/trừ/nhân/chia). Sử dụng kỹ thuật Bẻ gãy phản biện 'Tôi không nói... Tôi đang nói...'. Có thể dùng Ẩn dụ vật lý (vd: cái xô thủng) để minh họa.";
        } else if (upperPart.includes("PHẦN 4") || upperPart.includes("GIẢI PHÁP") || upperPart.includes("ACTIONABLE")) {
            arcInstruction = "Cung cấp lộ trình Step-by-step. Nêu rõ giải pháp này dành cho ai và không dành cho ai.";
        } else if (upperPart.includes("PHẦN 5") || upperPart.includes("ĐÚC KẾT") || upperPart.includes("TAKEAWAY")) {
            arcInstruction = "Chốt lại 1 câu triết lý tài chính sâu sắc bằng một câu Tục ngữ/Thành ngữ Việt Nam. Kêu gọi hành động (CTA) bằng cách đặt 1 câu hỏi thực tế xoáy vào hoàn cảnh của khán giả.";
        } else {
            arcInstruction = "Trình bày kiến thức tài chính một cách mạch lạc, chuyên nghiệp và có tính ứng dụng cao.";
        }
    }

    let prompt = isFinanceMode 
        ? `${FINANCE_DNA}\nVIẾT TIẾP PHẦN KỊCH BẢN: "${currentPartOutline}".\nCHỦ ĐỀ: ${title}.\nCHỈ DẪN: ${arcInstruction}\n${styleInstruction}\nNGÔN NGỮ: ${targetAudience}.\nBẮT BUỘC BẮT ĐẦU BẰNG TIÊU ĐỀ ##.`
        : `Viết tiếp phần kịch bản này dựa trên dàn ý: "${currentPartOutline}".
           Chủ đề video: "${title}".
           ${styleInstruction}
           Ngôn ngữ: ${targetAudience}.
           BẮT BUỘC bắt đầu bằng tiêu đề ##. Viết nội dung chi tiết, hấp dẫn.`;
    
    try { return await callApi(prompt, provider, model); } catch (error) { throw handleApiError(error, 'tạo phần kịch bản'); }
};

export const generateTopicSuggestions = async (title: string, provider: AiProvider, model: string): Promise<TopicSuggestionItem[]> => {
    const prompt = `Gợi ý 5 ý tưởng video YouTube về Tài chính cá nhân. Bắt buộc tạo Tiêu đề kích thích click chuột bằng 1 trong các công thức:
    1. Sự Thật Về [Chủ đề]: Tại Sao [Nỗ lực] Vẫn Thất bại?
    2. [Lựa chọn A] Hay [Lựa chọn B]? Tôi Đã Tính Ra Con Số Thật.
    3. [Ngành nghề] 2026: Cơ Hội Đổi Đời Hay Cái Bẫy?
    Trả về định dạng JSON: [{ "title": "Tiêu đề", "outline": "Dàn ý ngắn" }].`;
    try {
        const response = await callApi(prompt, provider, model);
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'gợi ý chủ đề'); }
};

export const reviseScript = async (script: string, revisionPrompt: string, params: any, provider: AiProvider, model: string): Promise<string> => {
    const { isFinanceMode, styleOptions } = params;
    const styleInstruction = styleOptions ? `Giữ vững Tone: ${styleOptions.expression} và Style: ${styleOptions.style}.` : '';
    
    const prompt = `Chỉnh sửa kịch bản theo yêu cầu: "${revisionPrompt}". 
    ${isFinanceMode ? 'LƯU Ý: Giữ vững triết lý cung cấp kiến thức tài chính thực tế và chuyên nghiệp.' : ''}
    ${styleInstruction}
    
    Kịch bản gốc:\n${script}`;
    try { return await callApi(prompt, provider, model); } catch (e) { throw handleApiError(e, 'sửa kịch bản'); }
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
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'tách lời thoại'); }
};

export const generateKeywordSuggestions = async (title: string, provider: AiProvider, model: string): Promise<string[]> => {
    const prompt = `Gợi ý 10 từ khóa SEO (anh/việt) cho video tài chính cá nhân: "${title}".`;
    try {
        const response = await callApi(prompt, provider, model);
        return response.split(',').map(k => k.trim());
    } catch (e) { handleApiError(e, 'gợi ý từ khóa'); return []; }
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
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'tạo prompt hình ảnh'); }
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
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'tạo tất cả prompt'); }
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
        const cleaned = cleanJsonResponse(response);
        const parsed = JSON.parse(cleaned);
        
        // Kiểm tra xem dữ liệu có phải là mảng không
        if (!Array.isArray(parsed)) {
            throw new Error("Dữ liệu AI trả về không đúng định dạng danh sách (Array).");
        }
        
        return parsed;
    } catch (e) { 
        throw handleApiError(e, 'chuyển thể kịch bản (vui lòng thử lại với model mạnh hơn)'); 
    }
};

export const suggestStyleOptions = async (title: string, provider: AiProvider, model: string): Promise<StyleOptions> => {
    const prompt = `Gợi ý Expression và Style phù hợp với kênh Tài chính cho "${title}". JSON: { "expression": "...", "style": "..." }`;
    try {
        const response = await callApi(prompt, provider, model);
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'gợi ý phong cách'); }
};

export const parseIdeasFromFile = async (content: string, provider: AiProvider, model: string): Promise<TopicSuggestionItem[]> => {
    const prompt = `Trích xuất ý tưởng video tài chính cá nhân từ nội dung file. JSON: { title, outline }.`;
    try {
        const response = await callApi(prompt, provider, model);
        return JSON.parse(cleanJsonResponse(response));
    } catch (e) { throw handleApiError(e, 'phân tích file'); }
};


export const scoreScript = async (script: string, provider: AiProvider, model: string): Promise<string> => {
    const prompt = `Bạn là chuyên gia thẩm định nội dung của kênh Tài chính cá nhân. Hãy chấm điểm kịch bản này dựa trên 8 tiêu chí cực kỳ khắt khe:
    1. Có sử dụng câu Slogan "Chú Que Tài Chính" và có cấu trúc 5 phần rõ ràng không?
    2. Có bóc tách chi phí bằng con số cụ thể, tính toán cộng trừ nhân chia rõ ràng không?
    3. Có nhắc đến Chi phí cơ hội hoặc Tâm lý học hành vi (ảo giác doanh thu, chi phí chìm...) không?
    4. Không nói lý thuyết suông, giải pháp có thực tiễn (step-by-step) không?
    5. CTA có đặt câu hỏi thực tế để khơi gợi bình luận không?
    6. Có tạo một nhân vật cụ thể (Tên + Tuổi + Mức lương) để kể chuyện không?
    7. Có sử dụng kỹ thuật Bẻ gãy phản biện "Tôi không nói... Tôi đang nói..." không?
    8. Có sử dụng Ẩn dụ vật lý (vd: xô thủng) và kết thúc bằng Tục ngữ/Thành ngữ Việt Nam không?`;
    try { return await callApi(prompt, provider, model); } catch (e) { throw handleApiError(e, 'chấm điểm kịch bản'); }
};

export const generateSingleVideoPrompt = async (scene: SceneSummary, config: SummarizeConfig, provider: AiProvider, model: string): Promise<string> => {
    const prompt = `Tạo video prompt (Tiếng Anh) cho cảnh quay tài chính: "${scene.summary}". Tập trung vào môi trường làm việc chuyên nghiệp, biểu đồ, không gian sáng sủa và năng động.`;
    try { return await callApi(prompt, provider, model); } catch (e) { throw handleApiError(e, 'tạo prompt video'); }
};

export const parseOutlineIntoSegments = (outline: string): string[] => {
    return outline.split(/(?=^## .*?$)/m).filter(s => s.trim() !== '' && !s.includes('### Dàn Ý'));
};
