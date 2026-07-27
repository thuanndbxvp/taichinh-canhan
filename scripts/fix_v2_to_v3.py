#!/usr/bin/env python3
"""Apply v3 changes to prompts/index.ts using byte-level operations."""

path = 'D:/Dark-Frontiers/src/services/ai/prompts/index.ts'

with open(path, 'rb') as f:
    data = f.read()

# 1. Bump V2 -> V3 in const V2 = ...
data = data.replace(
    b'const V2 = { version: \'2.0.0\', updatedAt: \'2026-07-27\', notes: \'DNA v2: Narrator Persona b\u1eafc bu\u1ed9c, Anti-Labeling, Vocabulary Diversity, Pacing <15% short sentences, Self-Verification checklist\' } as const;',
    b'const V3 = { version: \'3.0.0\', updatedAt: \'2026-07-27\', notes: \'DNA v3: Standard 5-step argument structure (N\u00ea\u2192Gi\u1ea3i th\u00edch\u2192V\u00ed d\u1ee5\u2192H\u1ec7 qu\u1ea3\u2192Chuy\u1ec3n), analytical narrator > storytelling, anti-flowery prose, metaphor limits\' } as const;'
)
print(f"Step 1 - V3 version: {b'V3' in data}")

# 2. Replace all "version: V2," with "version: V3,"
data = data.replace(b'version: V2,', b'version: V3,')
count = data.count(b'version: V3,')
print(f"Step 2 - version: V3, count: {count}")

# 3. Update arcInstructionFor - case 1, 2, 3, 4, 5
# case 1
data = data.replace(
    b'    case 1:\n      return \'T\u1ea1o Hook thu h\u00fat (b\u1eb1ng c\u00e2u chuy\u1ec7n ho\u1eb7c ngh\u1ecbch l\u00fd) -> Gi\u1edbi thi\u1ec7u Slogan ("Ch\u00e0o m\u1eebng anh em \u0111\u1ebfn v\u1edbi Ch\u00fa Que T\u00e0i Ch\u00ednh...") m\u1ed9t c\u00e1ch t\u1ef1 nhi\u00ean -> N\u00eau v\u1ea5n \u0111\u1ec1 ch\u00ednh c\u1ee7a video. NH\u1ece: ng\u01b0\u1eddi k\u1ec3 l\u00e0 ng\u01b0\u1eddi \u0111\u1ed3ng h\u00e0nh, k\u1ec3 chuy\u1ec7n ch\u1ee9 kh\u00f4ng tr\u00ecnh b\u00e0y.\';',
    b'    case 1:\n      return \'T\u1ea1o Hook thu h\u00fat (b\u1eb1ng c\u00e2u h\u1ecfi ho\u1eb7c ngh\u1ecbch l\u00fd) -> Gi\u1edbi thi\u1ec7u Slogan m\u1ed9t c\u00e1ch t\u1ef1 nhi\u00ean -> N\u00eau v\u1ea5n \u0111\u1ec1 ch\u00ednh. NH\u1ece: ng\u01b0\u1eddi k\u1ec3 l\u00e0 ng\u01b0\u1eddi ph\u00e2n t\u00edch b\u1eb1ng d\u1eef li\u1ec7u v\u00e0 l\u1eadp lu\u1eadn, gi\u1ecdng b\u00ecnh t\u0129nh, logic.\';'
)
print(f"Step 3a - case 1: {'ph\u00e2n t\u00edch' in data}")

# case 2
data = data.replace(
    b'    case 2:\n      return \'N\u00eau th\u1ef1c tr\u1ea1ng th\u1ecb tr\u01b0\u1eddng ho\u1eb7c b\u1eb1y t\u00e2m l\u00fd. S\u1eed d\u1ee5ng c\u00e2u chuy\u1ec7n nh\u00e2n v\u1eadt l\u00e0m v\u00ed d\u1ee5 \u0111\u1ec3 kh\u00e1n gi\u1ea3 d\u1ec5 \u0111\u1ed3ng c\u1ea3m. \u0110\u1ea2M B\u1ea2O: d\u00f9ng "t\u00f4i t\u1eebng...", "t\u00f4i hi\u1ec3u..." \u0111\u1ec3 t\u1ea1o k\u1ebft n\u1ed1i c\u1ea3m x\u00fac. KH\u00d4NG ph\u00e1n x\u00e9t.\';',
    b'    case 2:\n      return \'N\u00eau th\u1ef1c tr\u1ea1ng th\u1ecb tr\u01b0\u1eddng ho\u1eb7c b\u1eb1y t\u00e2m l\u00fd. D\u00f9ng C\u1ea4U TR\u00daC LU\u1eacN \u0110I\u1ec2M: N\u00eau v\u1ea5n \u0111\u1ec1 \u2192 Gi\u1ea3i th\u00edch (nhi\u1ec1u nh\u1ea5t) \u2192 V\u00ed d\u1ee5/s\u1ed1 li\u1ec7u \u2192 H\u1ec7 qu\u1ea3 \u2192 Chuy\u1ec3n \u00fd. KH\u00d4NG ph\u00e1n x\u00e9t, KH\u00d4NG hoa m\u1ef9.\';'
)
print(f"Step 3b - case 2: {'C\u1ea4U TR\u00daC' in data}")

# case 3
data = data.replace(
    b'    case 3:\n      return \'PH\u1ea6N QUAN TR\u1eccNG NH\u1ea4T: Ph\u00e2n t\u00edch v\u1ea5n \u0111\u1ec1 b\u1eb1ng c\u00e1c con s\u1ed1 th\u1ef1c t\u1ebf. T\u1ede L\u1ec6 C\u00c2U: <15% ng\u1eafn / 50-65% trung b\u00ecnh / 20-35% d\u00e0i. B\u1eae BU\u1ed8C s\u1eed d\u1ee5ng \u00edt nh\u1ea5t 1 h\u00ecnh \u1ea3nh \u1ea9n d\u1ee5 v\u1eadt l\u00fd quen thu\u1ed9c (nh\u01b0 c\u00e1i x\u00f4 th\u1ee7ng, m\u00e1y ch\u1ea1y b\u1ed9) \u0111\u1ec3 minh h\u1ecda cho t\u00ecnh tr\u1ea1ng t\u00e0i ch\u00ednh. \u0110\u1eebng qu\u00ean d\u00f9ng c\u1ea5u tr\u00fac "T\u00f4i kh\u00f4ng n\u00f3i... T\u00f4i \u0111ang n\u00f3i..." \u0111\u1ec3 r\u00e0o tr\u01b0\u1edbc ph\u1ea3n bi\u1ec7n.\';',
    b'    case 3:\n      return \'PH\u1ea6N QUAN TR\u1eccNG NH\u1ea4T: Ph\u00e2n t\u00edch v\u1ea5n \u0111\u1ec1 b\u1eb1ng con s\u1ed1 v\u00e0 l\u1eadp lu\u1eadn. C\u1ea4U TR\u00daC LU\u1eacN \u0110I\u1ec2M: N\u00eau v\u1ea5n \u0111\u1ec1 \u2192 Gi\u1ea3i th\u00edch (chi\u1ebfm nhi\u1ec1u nh\u1ea5t) \u2192 V\u00ed d\u1ee5/s\u1ed1 li\u1ec7u \u2192 H\u1ec7 qu\u1ea3 \u2192 Chuy\u1ec3n \u00fd. T\u1ede L\u1ec6 C\u00c2U: <15% ng\u1eafn / 50-65% trung b\u00ecnh / 20-35% d\u00e0i. D\u00f9ng c\u00e2u "m\u1edf n\u00fat" ho\u1eb7c "g\u00e0i" \u1edf cu\u1ed1i m\u1ed7i lu\u1eadn \u0111i\u1ec3m.\';'
)
print(f"Step 3c - case 3: {'chi\u1ebfm nhi\u1ec1u nh\u1ea5t' in data}")

# case 4
data = data.replace(
    b'    case 4:\n      return \'Cung c\u1ea5p l\u1ed9 tr\u00ecnh h\u00e0nh \u0111\u1ed9ng (Step-by-step) r\u00f5 r\u00e0ng, th\u1ef1c t\u1ebf. Ph\u00e2n lo\u1ea1i r\u00f5 gi\u1ea3i ph\u00e1p n\u00e0y h\u1ee3p v\u1edbi ai, kh\u00f4ng h\u1ee3p v\u1edbi ai.\';',
    b'    case 4:\n      return \'Cung c\u1ea5p l\u1ed9 tr\u00ecnh h\u00e0nh \u0111\u1ed9ng r\u00f5 r\u00e0ng. D\u00f9ng C\u1ea4U TR\u00daC LU\u1eacN \u0110I\u1ec2M cho m\u1ed7i gi\u1ea3i ph\u00e1p. D\u1eaeN D\u1eacT NH\u1ece NH\u00c0NG: d\u00f9ng "th\u1eed xem", "n\u1ebfu \u0111\u01b0\u1ee3c" thay v\u00ec "ph\u1ea3i l\u00e0m ngay". KH\u00d4NG d\u00f9ng "B\u01b0\u1edbc 1, 2, 3" m\u00e0 d\u00f9ng "tr\u01b0\u1edbc h\u1ebft... r\u1ed3i... cu\u1ed1i c\u00f9ng...". K\u1ebft th\u00fac b\u1eb1ng c\u00e2u "m\u1edf n\u00fat" v\u1ec1 ph\u1ea7n ti\u1ebfp theo.\';'
)
print(f"Step 3d - case 4: {'D\u1eaeN D\u1eacT NH\u1ece NH\u00c0NG' in data}")

# case 5
data = data.replace(
    b'    case 5:\n      return \'\\u0110\u01b0a ra m\u1ed9t \u0111\u00fac k\u1ebft/tri\u1ebft l\u00fd t\u00e0i ch\u00ednh s\u00e2u s\u1eafc. B\u1eae BU\u1ed8C ch\u1ed1t l\u1ea1i b\u1eb1ng 1 c\u00e2u Th\u00e0nh ng\u1eef/T\u1ee5c ng\u1eef d\u00e2n gian Vi\u1ec7t Nam cho th\u00e2n thi\u1ec7n. K\u1ebft th\u00fac b\u1eb1ng 1 c\u00e2u h\u1ecfi Call-To-Action xo\u00e1y v\u00e0o th\u1ef1c t\u1ebf kh\u00e1n gi\u1ea3.\';',
    b'    case 5:\n      return \'\\u0110\u01b0a ra \u0111\u00fac k\u1ebft tri\u1ebft l\u00fd t\u00e0i ch\u00ednh. C\u00e2u \u0111\u00fac k\u1ebft ph\u1ea3i d\u1ef1a tr\u00ean L\u1eacP LU\u1eacN \u0111\u00e3 tr\u00ecnh b\u00e0y, kh\u00f4ng ph\u1ea3i c\u1ea3m x\u00fac. K\u1ebft th\u00fac b\u1eb1ng c\u00e2u h\u1ecfi CTA xo\u00e1y v\u00e0o th\u1ef1c t\u1ebf kh\u00e1n gi\u1ea3. \u0110\u1ec2 C\u00c2U H\u1eceI TREO \u2014 kh\u00f4ng c\u1ea7n tr\u1ea3 l\u1eddi ngay, \u0111\u1ec3 kh\u00e1n gi\u1ea3 suy ngh\u0129.\';'
)
print(f"Step 3e - case 5: {'L\u1eacP LU\u1eacN' in data}")

# 4. Update enforcement block in buildFinanceSystemPrompt
# Find and replace the entire enforcement block
old_enforcement = b'=== L\u1ec6NH TH\u1ef0C THI B\u1eae BU\u1ed8C (AI KH\u00d4NG \u0110\u01af\u1ee2C B\u1ece QUA) ===\n\nTR\u01af\u1edc KHI VI\u1ebeT b\u1ea5t k\u1ef3 n\u1ed9i dung k\u1ecbch b\u1ea3n n\u00e0o, AI ph\u1ea3i:\n\n1. X\u00c1C \u0110\u1ecaNH G\u00d3C NH\u00ccN NG\u01af\u1ee2I K\u1ece:\n   - Ng\u01b0\u1eddi k\u1ec3 = "t\u00f4i" = m\u1ed9t ng\u01b0\u1eddi \u0111\u1ed3ng h\u00e0nh, \u0111i\u1ec1m t\u0129nh, \u0111\u00e3 t\u1eebng tr\u1ea3i.\n   - T\u00f4i KH\u00d4NG ph\u1ea3i gi\u1ea3ng vi\u00ean, KH\u00d4NG ph\u1ea3i b\u00e1ch khoa to\u00e0n th\u01b0, KH\u00d4NG ph\u1ea3i ng\u01b0\u1eddi trung l\u1eadp.\n   - Gi\u1ecdng k\u1ec3: k\u1ec3 chuy\u1ec7n \u2192 ph\u00e2n t\u00edch \u2192 r\u00fat b\u00e0i h\u1ecdc \u2192 h\u01b0\u1edbng d\u1eabn nh\u1eb9 nh\u00e0ng.\n   - KH\u00d4NG ph\u00e1n x\u00e9t: kh\u00f4ng n\u00f3i "ngu sao kh\u00f4ng hi\u1ec3u", kh\u00f4ng n\u00f3i "\u0111\u00e1ng l\u1eeb ph\u1ea3i v\u1eady".\n   - N\u1ebfu ph\u00e1t hi\u1ec7n m\u00ecnh \u0111ang PH\u00c1N X\u00c9T ho\u1eb7c TR\u00ccNH B\u00c0Y thay v\u00ec K\u1ece CHUY\u1ec6N \u2192 VI\u1ebeT L\u1ea0I.\n\n2. T\u1ef0 KI\u1ec2M TRA CHECKLIST (b\u1ecf qua n\u1ebfu \u0111\u00e3 tu\u00e2n th\u1ee7):\n   Sau khi vi\u1ebft xong m\u1ed7i \u0111o\u1ea1n, t\u1ef1 h\u1ecfi:\n   [ ] "anh em" c\u00f3 xu\u1ea5t hi\u1ec7n qu\u00e1 8 l\u1ea7n? \u2192 Thay b\u1eb1ng t\u00ean nh\u00e2n v\u1eadt / "m\u1ecdi ng\u01b0\u1eddi" / "ng\u01b0\u1eddi nghe".\n   [ ] C\u00f3 d\u00f9ng "B\u1eb1y s\u1ed1 1", "B\u01b0\u1edbc 1", "L\u1ef1c l\u01b0\u1ee3ng th\u1ee9 nh\u1ea5t"? \u2192 Thay b\u1eb1ng "th\u1ee9 m\u00e0 t\u00f4i th\u1ea5y...", "tr\u01b0\u1edbc h\u1ebft...".\n   [ ] C\u00f3 d\u00f9ng "\u0110\u1ea7u ti\u00ean", "Ti\u1ebfp theo", "T\u00f3m l\u1ea1i"? \u2192 Thay b\u1eb1ng t\u1eeb n\u1ed1i t\u1ef1 nhi\u00ean.\n   [ ] T\u1ef7 l\u1ec7 c\u00e2u ng\u1eafn c\u00f3 d\u01b0\u1edbi 15%? \u2192 N\u1ebfu kh\u00f4ng, gi\u1ea3m c\u00e2u ng\u1eafn.\n   [ ] C\u00f3 "kho\u1ea3ng tr\u1ed1ng" (im l\u1eb7ng, c\u00e2u h\u1ecfi treo)? \u2192 Th\u00eam \u00edt nh\u1ea5t 1 c\u00e2u kh\u00f4ng k\u1ebft lu\u1eadn ngay.\n   [ ] C\u00f3 slogan l\u1eb7p \u1ede gi\u1eefa script? \u2192 X\u00f3a, ch\u1ec9 gi\u1eef \u1ede \u0111\u1ea7u v\u00e0 cu\u1ed1i.\n\n3. N\u1ebeU VI PH\u1ea0M: script s\u1ebd b\u1ecb TR\u1ea2 V\u1ec0 \u0111\u1ec3 vi\u1ebft l\u1ea1i. Kh\u00f4ng c\u00f3 ngo\u1ea1i l\u1ec7.\n\n=== K\u1ebeT TH\u00daC L\u1ec6NH TH\u1ef0C THI ===`

new_enforcement = b'=== L\u1ec6NH TH\u1ef0C THI B\u1eae BU\u1ed8C (AI KH\u00d4NG \u0110\u01af\u1ee2C B\u1ece QUA) ===\n\nTR\u01af\u1edc KHI VI\u1ebeT b\u1ea5t k\u1ef3 n\u1ed9i dung k\u1ecbch b\u1ea3n n\u00e0o, AI ph\u1ea3i:\n\n1. X\u00c1C \u0110\u1ecaNH G\u00d3C NH\u00ccN NG\u01af\u1ee2I K\u1ece:\n   - Ng\u01b0\u1eddi k\u1ec3 = "t\u00f4i" = ng\u01b0\u1eddi c\u00f3 kinh nghi\u1ec7m ph\u00e2n t\u00edch v\u1ea5n \u0111\u1ec1 b\u1eb1ng d\u1eef li\u1ec7u v\u00e0 l\u1eadp lu\u1eadn.\n   - Gi\u1ecdng: b\u00ecnh t\u0129nh, logic, d\u1ef1a tr\u00ean s\u1ed1 li\u1ec7u. KH\u00d4NG c\u1ea3m t\u00ednh, KH\u00d4NG k\u00edch \u0111\u1ed9ng.\n   - \u01afu ti\u00ean GI\u1ea2I TH\u00cdCH h\u01a1n k\u1ec3 chuy\u1ec7n. K\u1ec3 chuy\u1ec7n ch\u1ec9 l\u00e0 MINH H\u1eccA cho l\u1eadp lu\u1eadn.\n   - KH\u00d4NG ph\u00e1n x\u00e9t ("ngu sao", "\u0111\u00e1ng l\u1eeb ph\u1ea3i v\u1eady"). Ph\u00e2n t\u00edch thay v\u00ec l\u00ean l\u1edbp.\n\n2. C\u1ea4U TR\u00daC LU\u1eacN \u0110I\u1ec2M CHU\u1ea8N (m\u1ed7i lu\u1eadn \u0111i\u1ec3m ch\u00ednh):\n   B\u01b0\u1edbc 1: N\u00eaU v\u1ea5n \u0111\u1ec1 \u2192 B\u01b0\u1edbc 2: GI\u1ea2I TH\u00cdCH (nhi\u1ec1u nh\u1ea5t) \u2192 B\u01b0\u1edbc 3: V\u00cd D\u1ee4/s\u1ed1 li\u1ec7u \u2192 B\u01b0\u1edbc 4: H\u1ec6 QU\u1ea2 \u2192 B\u01b0\u1edbc 5: CHUY\u1ec2N \u00dd (c\u00e2u m\u1edf n\u00fat/g\u00e0i).\n   N\u1ebfu vi\u1ebft m\u00e0 KH\u00d4NG theo c\u1ea5u tr\u00fac n\u00e0y cho lu\u1eadn \u0111i\u1ec3m ch\u00ednh \u2192 VI\u1ebeT L\u1ea0I.\n\n3. ANTI-FLOWERY PROSE:\n   - KH\u00d4NG t\u00ednh t\u1eeb th\u1eeba: "c\u1ef1c k\u1ef3", "v\u00f4 c\u00f9ng", "tuy\u1ec7t \u0111\u1ed1i", "kh\u1ee7ng khi\u1ebfp".\n   - KH\u00d4NG hoa m\u1ef9: "nh\u01b0 ph\u00e1t hi\u1ec7n ra ch\u00e2u M\u1ef9", "gi\u1ed1ng nh\u01b0 b\u1ecb s\u00e9t \u0111\u00e1nh".\n   - \u1ea8n d\u1ee5 ch\u1ec9 l\u00e0 GIA V\u1ec8. N\u1ebfu b\u1ecf \u1ea8n d\u1ee5 m\u00e0 v\u1eabn hi\u1ec3u \u2192 B\u1ece \u1ea8n D\u1ee4.\n   - N\u1ebfu ph\u00e1t hi\u1ec7n l\u1eadp lu\u1eadn y\u1ebfu m\u00e0 d\u00f9ng c\u1ea3m x\u00fac che \u2192 VI\u1ebeT L\u1ea0I l\u1eadp lu\u1eadn.\n\n4. T\u1ef0 KI\u1ec2M TRA CHECKLIST:\n   Sau khi vi\u1ebft xong, t\u1ef1 h\u1ecfi:\n   [ ] L\u1eadp lu\u1eadn \u0111\u1ee9ng kh\u00f4ng? (b\u1ecf t\u00ednh t\u1eeb c\u1ea3m x\u00fac, logic v\u1eabn r\u00f5?)\n   [ ] "anh em" c\u00f3 xu\u1ea5t hi\u1ec7n qu\u00e1 8 l\u1ea7n? \u2192 Thay b\u1eb1ng t\u00ean nh\u00e2n v\u1eadt.\n   [ ] C\u00f3 d\u00f9ng "B\u01b0\u1edbc 1", "Nguy\u00ean nh\u00e2n th\u1ee9 1"? \u2192 Thay b\u1eb1ng "tr\u01b0\u1edbc h\u1ebft...".\n   [ ] T\u1ef7 l\u1ec7 c\u00e2u ng\u1eafn d\u01b0\u1edbi 15%?\n   [ ] M\u1ed7i ph\u1ea7n k\u1ebft th\u00fac b\u1eb1ng c\u00e2u "m\u1edf n\u00fat" ch\u01b0a?\n\n5. N\u1ebeU VI PH\u1ea0M: script s\u1ebd b\u1ecb TR\u1ea2 V\u1ec0 \u0111\u1ec3 vi\u1ebft l\u1ea1i. Kh\u00f4ng c\u00f3 ngo\u1ea1i l\u1ec7.\n\n=== K\u1ebeT TH\u00daC L\u1ec6NH TH\u1ef0C THI ==='

if old_enforcement in data:
    data = data.replace(old_enforcement, new_enforcement)
    print(f"Step 4 - enforcement block: OK")
else:
    print(f"Step 4 - enforcement block: NOT FOUND")
    # Try to find partial
    if b'L\u1ec6NH TH\u1ef0C THI B\u1eae BU\u1ed8C' in data:
        print("  Partial match found")
    if b'X\u00c1C \u0110\u1ecaNH G\u00d3C NH\u00ccN' in data:
        print("  XAC DINH match found")

# 5. Update revise prompts - change the narrative description
data = data.replace(
    b'- Ng\u01b0\u1eddi k\u1ec3 = "t\u00f4i" = ng\u01b0\u1eddi \u0111\u1ed3ng h\u00e0nh. KH\u00d4NG ph\u00e1n x\u00e9t. KH\u00d4NG tr\u00ecnh b\u00e0y. Ph\u1ea3i k\u1ec3 chuy\u1ec7n.',
    b'- Ng\u01b0\u1eddi k\u1ec3 = ng\u01b0\u1eddi ph\u00e2n t\u00edch b\u1eb1ng d\u1eef li\u1ec7u v\u00e0 l\u1eadp lu\u1eadn. Gi\u1ecdng b\u00ecnh t\u0129nh, logic. \u01afu ti\u00ean GI\u1ea2I TH\u00cdCH h\u01a1n k\u1ec3 chuy\u1ec7n.'
)
print(f"Step 5 - revise prompts: {b'ph\u00e2n t\u00edch b\u1eb1ng d\u1eef li\u1ec7u' in data}")

with open(path, 'wb') as f:
    f.write(data)

# Verify
with open(path, 'rb') as f:
    verify = f.read()
v2_count = verify.count(b'version: V2,')
v3_count = verify.count(b'version: V3,')
print(f"\nFinal: V2 remaining={v2_count}, V3 found={v3_count}")
print(f"Enforcement block v3: {b'GI\u1ea2I TH\u00cdCH' in verify}")
print(f"ArcInstructionFor v3: {b'chi\u1ebfm nhi\u1ec1u nh\u1ea5t' in verify}")
print("Done!")
