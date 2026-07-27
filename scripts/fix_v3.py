#!/usr/bin/env python3
# Final v3 fix - clean replacement

path = 'D:/Dark-Frontiers/src/services/ai/prompts/index.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    # arcInstructionFor case 1
    ("return 'Tạo Hook thu hút (bằng câu chuyện hoặc nghịch lý) -> Giới thiệu Slogan",
     "return 'Tạo Hook thu hút (bằng câu hỏi hoặc nghịch lý) -> Giới thiệu Slogan"),
    # arcInstructionFor case 1 - remove Chú Que reference
    ('("Chào mừng anh em đến với Chú Que Tài Chính...") m', 'm'),
    # arcInstructionFor case 1 - narrator role
    ('NHỚ: người kể là người đồng hành, kể chuyện chứ không trình bày.',
     'NHỚ: người kể là người phân tích bằng dữ liệu và lập luận, giọng bình tĩnh, logic.'),
    # arcInstructionFor case 2
    ("return 'Nêu thực trạng thị trường hoặc bẫy tâm lý. Sử dụng câu chuyện nhân vật làm ví dụ để khán giả dễ đồng cảm.",
     "return 'Nêu thực trạng thị trường hoặc bẫy tâm lý."),
    ("return 'Nêu thực trạng thị trường hoặc bẫy tâm lý.\n' + '      return 'Nêu thực trạng",
     "return 'Nêu thực trạng"),
    # arcInstructionFor case 2 continued
    ("ĐẢM BẢO: dùng \"tôi từng...\", \"tôi hiểu...\" để tạo kết nối cảm xúc. KHÔNG phán xét.';",
     "Dùng CẤU TRÚC LUẬN ĐIỂM: Nêu vấn đề → Giải thích (nhiều nhất) → Ví dụ/số liệu → Hệ quả → Chuyển ý. KHÔNG phán xét, KHÔNG hoa mỹ.';"),
    # arcInstructionFor case 3
    ("return 'PHẦN QUAN TRỌNG NHẤT: Phân tích vấn đề bằng các con số thực tế.",
     "return 'PHẦN QUAN TRỌNG NHẤT: Phân tích vấn đề bằng con số và lập luận."),
    ("return 'PHẦN QUAN TRỌNG NHẤT: Phân tích vấn đề bằng con số và lập luận.\n' + '      return 'PHẦN QUAN",
     "return 'PHẦN QUAN"),
    # arcInstructionFor case 3 - remove metaphor requirement
    ("BẮT BUỘC sử dụng ít nhất 1 hình ảnh ẩn dụ vật lý quen thuộc (như cái xô thủng, máy chạy bộ) để minh họa cho tình trạng tài chính.",
     "Dùng CẤU TRÚC LUẬN ĐIỂM: Nêu vấn đề → Giải thích (chiếm nhiều nhất) → Ví dụ/số liệu → Hệ quả → Chuyển ý."),
    # arcInstructionFor case 3 - remove "Tôi không nói"
    ("Đừng quên dùng cấu trúc \"Tôi không nói... Tôi đang nói...\" để rào trước phản biện.",
     "Dùng câu \"mở nút\" hoặc \"gài\" ở cuối mỗi luận điểm."),
    # arcInstructionFor case 4 - step by step
    ("return 'Cung cấp lộ trình hành động (Step-by-step) rõ ràng, thực tế.",
     "return 'Cung cấp lộ trình hành động rõ ràng."),
    ("return 'Cung cấp lộ trình hành động rõ ràng.\n' + '      return 'Cung cấp",
     "return 'Cung cấp"),
    # arcInstructionFor case 4 - remove Phân loại
    ("Phân loại rõ giải pháp này hợp với ai, không hợp với ai.",
     ""),
    # arcInstructionFor case 5
    ("return 'Đưa ra một đúc kết/triết lý tài chính sâu sắc. BẮT BUỘC chốt lại bằng 1 câu Thành ngữ/Tục ngữ dân gian Việt Nam cho thân thiện.",
     "return 'Đưa ra đúc kết triết lý tài chính."),
    ("return 'Đưa ra đúc kết triết lý tài chính.\n' + '      return 'Đưa ra',
     "return 'Đưa ra"),
    # arcInstructionFor case 5 - conclusion based on logic
    ("Kết thúc bằng 1 câu hỏi Call-To-Action xoáy vào thực tế khán giả.",
     "Câu đúc kết phải dựa trên LẬP LUẬN đã trình bày, không phải cảm xúc. Kết thúc bằng câu hỏi CTA xoáy vào thực tế khán giả."),
    # enforcement block - narrator
    ("   - Người kể = \"tôi\" = một người đồng hành, điềm tĩnh, đã từng trải.",
     "   - Người kể = \"tôi\" = người có kinh nghiệm phân tích vấn đề bằng dữ liệu và lập luận."),
    # enforcement block - narrator NOT
    ("   - Tôi KHÔNG phải giảng viên, KHÔNG phải bách khoa toàn thư, KHÔNG phải người trung lập.",
     "   - KHÔNG phải giảng viên, KHÔNG phải bách khoa toàn thư, KHÔNG phải người trung lập."),
    # enforcement block - tone
    ("   - Giọng kể: kể chuyện → phân tích → rút bài học → hướng dẫn nhẹ nhàng.",
     "   - Giọng: bình tĩnh, logic, dựa trên số liệu. KHÔNG cảm tính, KHÔNG kích động."),
    # enforcement block - anti-judgment
    ("   - KHÔNG phán xét: không nói \"ngu sao không hiểu\", không nói \"đáng lẽ phải vậy\".",
     "   - KHÔNG cảm tính, KHÔNG hoa mỹ. Phân tích thay vì lên lớp."),
    # enforcement block - self-check
    ("   - Nếu phát hiện mình đang PHÁN XÉT hoặc TRÌNH BÀY thay vì KỂ CHUYỆN → VIẾT LẠI.",
     "   - Ưu tiên GIẢI THÍCH hơn kể chuyện. Kể chuyện chỉ là MINH HỌA cho lập luận."),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new, 1)
        count += 1
        print("Replaced: %s" % old[:40])
    else:
        print("NOT FOUND: %s" % old[:40])

print("\nTotal: %d/%d replacements" % (count, len(replacements)))

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done!")
