import React from 'react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-secondary rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.82 1.507-2.098a5.981 5.981 0 1 0-7.514 0C9.092 15.988 9.75 16.825 9.75 17.808v.192" />
                    </svg>
                    <div>
                        <h2 className="text-xl font-bold text-accent">Hướng dẫn chọn Model AI</h2>
                        <p className="text-sm text-text-secondary mt-1">Gợi ý model phù hợp nhất cho kịch bản bám sát DNA</p>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto flex-grow prose prose-invert max-w-none prose-sm">
                    <p className="text-text-primary mb-4">
                        Dựa vào đặc thù ứng dụng của bạn là <strong>viết kịch bản bám sát 100% theo Prompt DNA</strong> (đòi hỏi khả năng tuân thủ định dạng, văn phong, cấu trúc chặt chẽ), dưới đây là các đề xuất tốt nhất từ KymaAPI:
                    </p>

                    <h3 className="text-lg font-semibold text-accent mt-6 mb-2">1. Lựa chọn xuất sắc nhất (Top-tier Instruction Following)</h3>
                    <p className="text-text-secondary mb-2">Nếu bạn cần AI tuân thủ Prompt một cách tuyệt đối, viết văn phong tự nhiên, logic sắc bén và không bị "ảo giác" (hallucinate):</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-4">
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">qwen-3.7-max</code> / <code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">qwen-3.6-plus</code></strong>: Dòng Qwen của Alibaba hiện đang cực kỳ xuất sắc trong việc hiểu tiếng Việt tự nhiên và tuân thủ các prompt hệ thống phức tạp (như DNA). <em>qwen-3.6-plus</em> đang là model phổ biến nhất vì cân bằng hoàn hảo giữa giá và chất lượng.</li>
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-v3</code></strong>: Vô cùng ổn định và nổi tiếng về khả năng làm theo mẫu (template) hoặc format định sẵn. DeepSeek V3 viết tiếng Việt rất mượt và giá thành hợp lý.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-accent mt-6 mb-2">2. Lựa chọn tối ưu tốc độ & chi phí (Flash/Fast Models)</h3>
                    <p className="text-text-secondary mb-2">Nếu bạn cần tạo kịch bản nhanh, rẻ mà vẫn đảm bảo bám sát DNA (tốt cho việc tạo số lượng lớn kịch bản hàng ngày):</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-4">
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-v4-flash</code></strong>: Siêu rẻ, tốc độ phản hồi cực nhanh mà vẫn giữ được logic của hệ DeepSeek. Rất phù hợp nếu DNA của bạn đã được thiết kế chi tiết.</li>
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">gemini-2.5-flash</code> / <code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">gemini-3-flash</code></strong>: Gemini Flash nổi tiếng với tốc độ siêu nhanh và khả năng bám prompt rất tốt khi được cung cấp context đầy đủ.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-accent mt-6 mb-2">3. Lựa chọn thiên về lập luận chuyên sâu (Reasoning Models)</h3>
                    <p className="text-text-secondary mb-2">Nếu kịch bản Tài chính cá nhân của bạn đi sâu vào phân tích số liệu, giải thích cơ chế dòng tiền phức tạp:</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-4">
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-r1</code></strong>: Đây là model mạnh nhất về Reasoning (lập luận). Nếu DNA yêu cầu AI phải "suy nghĩ" để đưa ra các lập luận tài chính logic trước khi viết kịch bản, R1 sẽ là lựa chọn vô đối (rẻ hơn o1 của OpenAI rất nhiều).</li>
                    </ul>

                    <div className="bg-primary/50 border border-accent/30 p-4 rounded-lg mt-6">
                        <strong className="text-accent block mb-1">💡 Đề xuất khuyên dùng:</strong>
                        <p className="text-sm text-text-primary m-0">Hãy nhập thử <code className="text-yellow-400 font-bold bg-secondary px-1 py-0.5 rounded">qwen-3.6-plus</code> hoặc <code className="text-yellow-400 font-bold bg-secondary px-1 py-0.5 rounded">deepseek-v3</code> vào ô "Custom Model Name". Đây là 2 model được đánh giá là tạo ra văn bản tiếng Việt "người" nhất và tuân thủ luật (DNA) tốt nhất ở thời điểm hiện tại.</p>
                    </div>
                </div>

                <div className="p-5 border-t border-border flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-accent hover:brightness-110 text-white font-bold rounded-md transition"
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
}
