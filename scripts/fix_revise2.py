#!/usr/bin/env python3
# Fix revise prompts - read actual bytes, replace, write
path = 'D:/Dark-Frontiers/src/services/ai/prompts/index.ts'

with open(path, 'rb') as f:
    data = f.read()

# Find the v2 DNA block
idx = data.find(b'DNA v2 B')
if idx < 0:
    print("DNA v2 block not found!")
    exit(1)

# Find the end of the block (=== KET THUC LENH ===)
end = data.find(b'=== K', idx)
if end < 0:
    end = data.find(b'KET', idx)
    if end < 0:
        print("End marker not found!")
        exit(1)
    end = end + len(b'KET THUC LENH ===')

# Extract the block
old_block = data[idx-5:end+5]
print("Old block found, length:", len(old_block))

# New block
new_block = (
    b'DNA v3 B\xc3\x90T BU\xe1\xbb\x98C ===\n'
    b'- Ng\xc6\xb0\xe1\xbb\x9di k\xe1\xbb\x83 = ng\xc6\xb0\xe1\xbb\x9di ph\xc3\xa2n '
    b't\xc3\xadchn b\xe1\xba\xb1ng d\xe1\xbb\xaf li\xe1\xbb\x87u v\xc3\xa0 l\xe1\xba\xadp lu\xe1\xba\xa1n. '
    b'Gi\xe1\xbb\x8dng b\xc3\xacnh t\xc4\xa9nh, logic. \xc6\xafu ti\xc3\xa9n GI\xe1\xba\xa3I TH\xc3\x8dCH h\xc6\xa1n k\xe1\xbb\x83 chuy\xe1\xbb\x87n.\n'
    b'- C\xe1\xba\xa5u tr\xc3\xbac lu\xe1\xba\xa1n \xc4\x91i\xe1\xbb\x83m: N\xc3\xaau \xe2\x86\x92 Gi\xe1\xba\xa3i th\xc3\xadch (nhi\xe1\xbb\x81u nh\xe1\xba\xa5t) \xe2\x86\x92 V\xc3\xad d\xe1\xbb\xa5e \xe2\x86\x92 H\xe1\xbb\x87 qu\xe1\xba\xa3 \xe2\x86\x92 Chuy\xe1\xbb\x83n.\n'
    b'- Anti-Flowery: KH\xc3\x94NG "c\xe1\xbb\xb1c k\xe1\xbb\xb3", "v\xc3\xb4 c\xc3\xb9ng". L\xe1\xba\xadp lu\xe1\xba\xa1n l\xc3\xa0 m\xc3\xb3n ch\xc3\xadchn.\n'
    b'- T\xe1\xbb\x9f l\xe1\xbb\x87 c\xc3\xa2u: <15% ng\xe1\xba\xafn / 50-65% TB / 20-35% d\xc3\xa0i.\n'
    b'- Anti-Labeling: KH\xc3\x94NG "B\xc6\xb0\xe1\xbb\x9bc 1", "Nguy\xc3\xaan nh\xc3\xa2n th\xe1\xbb\xa9 1".\n'
    b'- "anh em" t\xe1\xbb\x91i \xc4\x91\xc4\x91a 8 l\xe1\xba\xa7n/\xc4\x91o\xe1\xba\xa1n.\n'
    b'- Slogan ch\xe1\xbb\x89 2 l\xe1\xba\xa7n: \xc4\x91\xe1\xba\xa7u + cu\xe1\xbb\x91i.\n'
    b'=== K\xc3\x90T TH\xc3\x9aC L\xc3\x96NH ==='
)

print("New block length:", len(new_block))
print("Replace?", len(old_block), "==", len(new_block))

# Replace
data = data[:idx-5] + new_block + data[end+5:]

with open(path, 'wb') as f:
    f.write(data)

print("Done!")
