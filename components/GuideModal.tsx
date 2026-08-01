import React from 'react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-secondary rounded-lg shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col border border-border" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.82 1.507-2.098a5.981 5.981 0 1 0-7.514 0C9.092 15.988 9.75 16.825 9.75 17.808v.192" />
                    </svg>
                    <div>
                        <h2 className="text-xl font-bold text-accent">Hướng dẫn sử dụng Hệ thống AI</h2>
                        <p className="text-sm text-text-secondary mt-1">Bí kíp tạo kịch bản bám sát 100% DNA Chú Que</p>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto flex-grow prose prose-invert max-w-none prose-sm">
                    <h3 className="text-lg font-semibold text-accent mb-2">1. Quy tắc Móng & Gia vị (Tạo kịch bản mới)</h3>
                    <p className="text-text-secondary mb-2">Hệ thống phân định rạch ròi 2 trường thông tin để AI không bị loạn:</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-6">
                        <li><strong>Tiêu đề (Móng):</strong> Đây là xương sống của kịch bản. Nó quyết định trực tiếp đến DNA sẽ được sử dụng (VD: Tâm lý, Bóc phốt, hay Phân tích số liệu). AI sẽ ưu tiên bảo vệ Tiêu đề cao nhất.</li>
                        <li><strong>Yêu cầu Đạo diễn (Gia vị):</strong> Nơi bạn nhập các ý phụ, góc nhìn riêng, số liệu cụ thể. Giới hạn ở 800 ký tự. AI bắt buộc phải lồng ghép các ý này vào bài, nhưng tuyệt đối không được làm lệch Tiêu đề.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-accent mt-6 mb-2">2. Tính năng Tẩy rửa (Rewrite Mode)</h3>
                    <p className="text-text-secondary mb-2">Dùng khi bạn có sẵn một bài báo dài, hoặc một kịch bản do ChatGPT viết quá hoa mỹ, lê thê:</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-6">
                        <li>Bấm nút <strong>"♻️ Tẩy rửa kịch bản gốc"</strong> ở màn hình chính để mở giao diện Side-by-side.</li>
                        <li><strong>Mức 1 (Sửa văn phong):</strong> Giữ nguyên cấu trúc bài cũ, chỉ cắt tỉa từ ngữ thừa (Anti-flowery) và ép giọng điệu điềm tĩnh của DNA.</li>
                        <li><strong>Mức 2 (Gò lại 5 phần):</strong> Đập đi xây lại toàn bộ bài viết, ép chặt vào cấu trúc 5 bước chuẩn của kênh (Hook → Vấn đề → Phân tích → Giải pháp → Đúc kết).</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-accent mt-6 mb-2">3. Hướng dẫn chọn Model AI</h3>
                    <p className="text-text-secondary mb-2">Dưới đây là các model tốt nhất để chạy kịch bản theo DNA này:</p>
                    <ul className="list-disc pl-5 text-text-primary space-y-2 mb-4">
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">qwen-3.6-plus</code> / <code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-v3</code></strong>: Top-tier Instruction Following, viết tiếng Việt siêu mượt, rất khuyên dùng.</li>
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-r1</code></strong>: Reasoning Model, dành cho các kịch bản cần lập luận phân tích tài chính sâu sắc.</li>
                        <li><strong><code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">deepseek-v4-flash</code> / <code className="text-yellow-400 bg-primary px-1 py-0.5 rounded">gemini-3-flash</code></strong>: Tốc độ siêu nhanh, chi phí siêu rẻ.</li>
                    </ul>
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
