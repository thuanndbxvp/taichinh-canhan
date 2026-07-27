#!/usr/bin/env python3
# Commit DNA v3 changes
import subprocess
import os

os.chdir('D:/Dark-Frontiers')

# Commit message
msg = """docs(dna): nang cap DNA len v3 — cau truc luan diem + analytical narrator

Thay doi chinh:

**finance-core.md (v3):**
- Them §6C Cau truc luan diem chuan (5 buoc: Ne -> Giai thich -> Vi du -> He qua -> Chuyen)
- Can bang §6B narrator persona: uu tien phan tich > ke chuyen
- Them giọng bình tĩnh, logic, dựa trên dữ liệu
- Them §9.4 Anti-Flowery Prose (khong hoa my, khong lam du an du)
- Cap nhat checklist voi cac muc moi

**prompts/index.ts (v3):**
- Bump version: V2 -> V3 (22 instances)
- Cap nhat enforcement block trong buildFinanceSystemPrompt
- Cap nhat arcInstructionFor voi DNA v3 rules
- Cap nhat revise prompts voi DNA v3 enforcement

**Yeu cau tu nguoi dung:**
- Huong dan van phong thuyet minh-phan tich cho video 15-30 phut
- Nguoi ke = nguoi co kinh nghiem phan tich bang du lieu va lap luan
- Giong binh tinh, logic, de nghe
- Uu tien giai thich hon ke chuyen
- Khong hoa my, khong cam tinh, khong phan xet
- Tim kiem: DNA v3, analytical narrator, anti-flowery, argument structure
"""

with open('__commit_msg.txt', 'w', encoding='utf-8') as f:
    f.write(msg)

# Git add and commit
subprocess.run(['git', 'add', 'docs/dna/finance-core.md', 'src/services/ai/prompts/index.ts', 'scripts/'], check=True)
subprocess.run(['git', 'commit', '-F', '__commit_msg.txt'], check=True)
print("Committed!")

# Cleanup
import os
os.remove('__commit_msg.txt')
