#!/usr/bin/env python3
# Extract exact bytes from prompts/index.ts
with open('D:/Dark-Frontiers/src/services/ai/prompts/index.ts', 'rb') as f:
    data = f.read()

# Find the enforcement block start
searches = [
    b'Ng\u01b0',
    b'Gi\u1ecdng',
    b'case 1:',
    b'case 2:',
    b'case 3:',
    b'case 4:',
    b'case 5:',
    b'Step-by-step',
    b'\u0110\u01b0a',
]

for s in searches:
    idx = data.find(s)
    if idx >= 0:
        print(f"FOUND '{s[:20]}' at {idx}: {data[idx:idx+50].hex()[:80]}")
    else:
        print(f"NOT FOUND: {s[:20]}")
