#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Commit the DNA refactor with proper UTF-8 message."""
import subprocess

msg = """Refactor DNA into Core + 4 branches + Hook library

Phân tách prompt DNA thành mô hình Core-Modules dựa trên phân tích
50 script kênh Chú Que Tài Chính:

- finance-core.md (đã có sẵn): DNA Lõi - áp dụng cho mọi script
- finance-listicle.md: Nhánh Listicle Actionable (23/50 script)
- finance-analytical.md: Nhánh Phân tích Tài chính (14/50 script)
- finance-psychology.md: Nhánh Tâm lý xã hội (9/50 script)
- finance-mythbusting.md: Nhánh Bóc phốt/Myth-busting (4-18/50 script)
- finance-hooks.md: Thư viện 4 kiểu Hook (Story, Data, Myth-busting, Question)

Mỗi file nhánh chứa:
- Pattern tiêu đề và đặc điểm nhận dạng
- Cấu trúc script riêng
- Phong cách văn phong, tông giọng
- Checklist chống cứng nhắc
- Ví dụ mẫu chuẩn hóa

Bổ sung: 5 file Python script trong scripts/ để regenerate các file
DNA với UTF-8 đúng chuẩn (tránh lỗi encoding PowerShell).
"""

with open(r'D:\Dark-Frontiers\__commit_msg.txt', 'w', encoding='utf-8') as f:
    f.write(msg)

print("Commit msg written. Now calling git...")
