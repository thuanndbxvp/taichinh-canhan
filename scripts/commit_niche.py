#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Commit + push niche-finance.md updates."""
import subprocess
import os

repo = r'D:\Dark-Frontiers'
os.chdir(repo)

# Stage changes
print("== git status ==")
subprocess.run(['git', 'status'], check=True)

print("\n== git add ==")
subprocess.run(['git', 'add', 'docs/dna/niche-finance.md', 'scripts/gen_dna_niche.py', 'docs/dna/finance-core.md'], check=True)

# Write commit message with proper UTF-8
msg = """docs(dna): thêm niche-finance.md — Niche Profile tổng + commit helper

Bước 5: Xây file niche-finance.md (profile tổng) — define NicheProfile
struct để add niche mới (horror, storytelling, ...) chỉ bằng cách
thay core + branches.

niche-finance.md (665 dòng, 27 KB) bao gồm:
- §1 Khái niệm niche + ví dụ 5 niche có thể mở rộng
- §2 Schema NicheProfile 7 thành phần (YAML):
  • metadata, core_dna, branches, hooks, routing_rules,
    few_shot, constraints (hard + soft)
- §3 Template ghép prompt hoàn chỉnh (giữa core + branch + hook + few-shot)
- §4 Routing decision tree (5 rules + ưu tiên khi 2 rules match)
- §5 Workflow thực tế trong app (input → routing → validate → output)
- §6 Hướng dẫn thêm niche mới (4 bước) — KHÔNG cần sửa code
- §7 Checklist triển khai (cho niche hiện tại + niche mới)
- §8 Tóm tắt mục đích file

scripts/gen_dna_niche.py:
- Python helper viết YAML/Markdown với UTF-8 reliable
- Tránh lỗi encoding PowerShell cp1252

docs/dna/finance-core.md:
- Bỏ 'sẽ viết ở bước cuối' → refer sang niche-finance.md §3

Refs: Step 5 của DNA refactor plan (Core & Modules separation).
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
