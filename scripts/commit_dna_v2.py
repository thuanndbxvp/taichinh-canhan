#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Commit + push DNA v2 files."""
import subprocess
import os

repo = r'D:\Dark-Frontiers'
os.chdir(repo)

print("== git status ==")
subprocess.run(['git', 'status'], check=True)

print("\n== git add ==")
files = [
    'docs/dna/finance-core.md',
    'docs/dna/finance-hooks.md',
    'docs/dna/finance-listicle.md',
    'docs/dna/finance-analytical.md',
    'docs/dna/finance-psychology.md',
    'docs/dna/finance-mythbusting.md',
    'scripts/gen_dna_v2.py',
]
subprocess.run(['git', 'add'] + files, check=True)

msg = """docs(dna): v2 — khắc phục script quá máy móc, tăng giọng tác giả

Cập nhật toàn bộ 6 file DNA lên v2 dựa trên feedback người dùng:
- Điểm thấp nhất: Giọng tác giả 7.2 / 10 (quá "đọc máy")
- Cải thiện target: Voice 7.2→8.5, Rhythm 8.0→8.8, Imagery 7.6→8.5

=== THAY ĐỔI CHÍNH ===

1. finance-core.md v2:
   §7 MỚI — Giọng tác giả: bảng xưng hô đa dạng
     (tôi từng / biết điều gì / thật lòng / có thể sai / tôi hiểu)
   §7.3 MỚI — Khoảng trống (Silence): im lặng có chủ đích,
     dấu "..." trong văn, câu hỏi treo, không kết luận ngay
   §8 MỚI — Anti-Labeling: bảng thay thế "Bẫy số 1"/"Bước 1"
     → "đây là thứ tôi thấy..." / "trước hết..."
   §9 MỚI — Đa dạng hóa từ vựng: thay thế "anh em/phải/
     chính là/sai rồi" bằng bảng từ đa dạng
   §6.2 Slogan: giới hạn 2 lần/script, không lặp giữa script
   §5.2 Nhịp điệu: tỷ lệ 25-35% ngắn / 40-50% TB / 15-25% dài
   §5.4 Thêm cảnh báo: "đọc 1 phút mà thấy nhịp đều → SAI"

2. finance-hooks.md v2:
   §7 MỚI — Anti-Formula: 5 kỹ thuật chống hook công thức
     (1) bắt đầu giữa câu chuyện
     (2) im lặng có chủ đích
     (3) góc nhìn bất ngờ
     (4) câu mở không cần câu hỏi
     (5) để người nghe tự nhận ra
   §8 MỚI — Hook Calibration: 5 câu tự hỏi kiểm tra hook
   §7.3 Tỷ lệ: 2-3 hook pattern chuẩn + 1-2 hook bất ngờ/tuần

3. finance-listicle.md v2:
   §4 MỚI — Giọng tác giả trong mỗi mục
   §7 MỚI — Anti-Labeling: "Mục 1" → "Thứ nhất..." hoặc không đánh số
   §3.2 Nhịp điệu: thêm ví dụ cụ thể về đan xen ngắn-dài

4. finance-analytical.md v2:
   §7 MỚI — Anti-Labeling: "Nguyên nhân 1,2,3" → "Có mấy thứ
     tôi muốn nói"
   §8 MỚI — Giọng tác giả: khoảng trống + "tôi không chắc"

5. finance-psychology.md v2:
   §2.4 MỚI — Tone 4 Người kể chuyện: cao cấp nhất, kể cảm xúc
     không phải sự kiện ("Minh, 28 tuổi. Mỗi đêm Minh nằm trằn trọc.")
   §7 MỚI — Anti-Labeling: "3 nguồn gốc" → "Có mấy thứ đan lại..."
   §8 MỚI — Giọng tác giả MẠNH: "tôi nhớ cảm giác đó",
     "đêm đó tôi không ngủ được", im lặng có chủ đích

6. finance-mythbusting.md v2:
   §7 MỚI — Anti-Labeling: "3 lý do" → "có một thứ tôi thường thấy"
   §8 MỚI — Giọng tác giả: sắc nhưng không công kích,
     "tôi cũng từng ở đó", thất vọng nhẹ nhàng

=== MAPPING FEEDBACK → FIX ===

| Feedback | Fix |
|---|---|
| "Chỉ mang tính dòng thông tin" | §7 Giọng tác giả, §7.3 Khoảng trống |
| "Thích dán nhãn và liệt kê" | §8 Anti-Labeling (6 files) |
| "Nhịp đều đặn" | §5.2 Pacing tỷ lệ, §3 nhịp đan xen |
| "Từ vựng nghèo nàn" | §9 Đa dạng hóa từ vựng |
| "Lạm dụng slogan" | §3.1 Giới hạn 2 lần/script |
| "Quá thẳng thắn, đóng" | §7.3 Khoảng trống, §7.4 Im lặng |
| "Thiếu giọng tác giả" | §7 Giọng tác giả (6 files) |

Scripts/gen_dna_v2.py: viết lại 6 file với UTF-8 reliable.

Refs: User review 2026-07-27 — Kịch bản 2 scores.
"""

print("\n== git commit ==")
with open('__commit_msg.txt', 'w', encoding='utf-8') as f:
    f.write(msg)
try:
    subprocess.run(['git', 'commit', '-F', '__commit_msg.txt'], check=True)
finally:
    if os.path.exists('__commit_msg.txt'):
        os.remove('__commit_msg.txt')

print("\n== git push ==")
subprocess.run(['git', 'push'], check=True)

print("\n== git log --oneline -5 ==")
subprocess.run(['git', 'log', '--oneline', '-5'], check=True)
