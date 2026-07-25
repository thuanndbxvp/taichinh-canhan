#!/usr/bin/env python3
"""Convert prompts/index.ts từ UTF-16 LE sang UTF-8 BOM (preserve content)."""
import sys

SRC = r'D:\Dark-Frontiers\src\services\ai\prompts\index.ts'

with open(SRC, 'rb') as f:
    raw = f.read()

# Detect encoding
if raw[:2] in (b'\xff\xfe', b'\xfe\xff'):
    text = raw.decode('utf-16-le' if raw[:2] == b'\xff\xfe' else 'utf-16-be')
elif raw[:3] == b'\xef\xbb\xbf':
    text = raw[3:].decode('utf-8')
elif raw[:4] == b'\x00\x00\xfe\xff' or raw[:4] == b'\xff\xfe\x00\x00':
    text = raw.decode('utf-32')
else:
    # Heuristic: nếu bytes > 50% là null bytes → UTF-16
    null_ratio = raw[:200].count(b'\x00') / max(len(raw[:200]), 1)
    if null_ratio > 0.3:
        text = raw.decode('utf-16-le', errors='replace')
        print(f'Heuristic detected UTF-16 LE ({null_ratio:.0%} nulls)')
    else:
        text = raw.decode('utf-8', errors='replace')
        print('Heuristic detected UTF-8')

# Normalize newlines to LF (Vite/Node expects LF on save)
text = text.replace('\r\n', '\n').replace('\r', '\n')

# Write UTF-8 with BOM
with open(SRC, 'wb') as f:
    f.write(b'\xef\xbb\xbf')
    f.write(text.encode('utf-8'))

print(f'Wrote {len(text)} chars in UTF-8 BOM')
print('First 200 chars:')
print(text[:200])