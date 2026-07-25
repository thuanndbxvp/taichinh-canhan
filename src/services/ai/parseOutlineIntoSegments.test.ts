import { describe, it, expect } from 'vitest';
import { parseOutlineIntoSegments } from './parseOutlineIntoSegments';

describe('parseOutlineIntoSegments', () => {
  it('trả [] nếu outline rỗng', () => {
    expect(parseOutlineIntoSegments('')).toEqual([]);
    expect(parseOutlineIntoSegments('   ')).toEqual([]);
  });

  it('match chuẩn ## PHẦN 1..5 (format ideal)', () => {
    const outline = `### Dàn Ý Chi Tiết (Chuẩn bị tạo kịch bản sạch cho TTS)

## PHẦN 1: MỞ ĐẦU (HOOK & SETUP)
Nội dung phần 1.

## PHẦN 2: BỐI CẢNH & VẤN ĐỀ (PROBLEM)
Nội dung phần 2.

## PHẦN 3: GIẢI PHẪU (ANALYSIS)
Nội dung phần 3.

## PHẦN 4: GIẢI PHÁP (ACTIONABLE)
Nội dung phần 4.

## PHẦN 5: ĐÚC KẾT (TAKEAWAY)
Nội dung phần 5.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(5);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[4]).toMatch(/PHẦN 5/);
    expect(segs[4]).toMatch(/Nội dung phần 5/);
    // Bỏ header "### Dàn Ý"
    expect(segs[0]).not.toMatch(/Dàn Ý/);
  });

  it('match ### PHẦN X (level 3 heading)', () => {
    const outline = `### PHẦN 1: Mở đầu
A.

### PHẦN 2: Bối cảnh
B.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[1]).toMatch(/PHẦN 2/);
  });

  it('match **PHẦN X** (bold marker)', () => {
    const outline = `**PHẦN 1: MỞ ĐẦU**
A.

**PHẦN 2: BỐI CẢNH**
B.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[1]).toMatch(/PHẦN 2/);
  });

  it('match plain "PHẦN 1: ..." ở đầu dòng (không có markdown)', () => {
    const outline = `PHẦN 1: MỞ ĐẦU
Nội dung A.

PHẦN 2: BỐI CẢNH
Nội dung B.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[1]).toMatch(/PHẦN 2/);
  });

  it('fallback keyword khi AI không có header rõ ràng', () => {
    // AI chỉ viết 1 khối liền, có keyword PHẦN 1/2 ở giữa dòng.
    const outline = `Mở đầu: PHẦN 1 hook nhỏ. Chi tiết thì...

Tiếp theo PHẦN 2: vấn đề chính. Rồi PHẦN 3 phân tích.

Cuối cùng PHẦN 5: takeaway.`;
    const segs = parseOutlineIntoSegments(outline);
    // Ít nhất 2 segments, keyword được nhận
    expect(segs.length).toBeGreaterThanOrEqual(3);
    expect(segs.some((s) => s.includes('PHẦN 1'))).toBe(true);
    expect(segs.some((s) => s.includes('PHẦN 5'))).toBe(true);
  });

  it('trả toàn bộ outline làm 1 segment khi không có header nào', () => {
    const outline = `Mở bài thì sao, phát triển thì sao, kết thúc thì sao.
Một đoạn văn liền mạch không có phần.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(1);
    expect(segs[0]).toBe(outline.trim());
  });

  it('cap segments nếu AI match quá nhiều (false positive)', () => {
    // AI lặp "PHẦN 1" 20 lần → cap 5
    const outline = Array.from({ length: 20 }, (_, i) => `PHẦN 1 ý số ${i + 1}`).join('\n');
    const segs = parseOutlineIntoSegments(outline);
    expect(segs.length).toBeLessThanOrEqual(10);
  });

  it('không nhầm "PHẦN 1" trong dòng diễn giải khi có heading rõ', () => {
    const outline = `Intro: PHẦN 1 nói về hook.

## PHẦN 1: MỞ ĐẦU
Content A.

## PHẦN 2: BỐI CẢNH
Content B.`;
    const segs = parseOutlineIntoSegments(outline);
    // Heading regex anchor `^` → không match dòng intro. Có 2 segments.
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[0]).toMatch(/Content A/);
    expect(segs[1]).toMatch(/PHẦN 2/);
  });

  it('content trước header đầu tiên bị bỏ (preamble)', () => {
    const outline = `Một số dòng preamble ngẫu nhiên ở đầu.

## PHẦN 1: MỞ ĐẦU
A.`;
    const segs = parseOutlineIntoSegments(outline);
    expect(segs).toHaveLength(1);
    expect(segs[0]).toMatch(/PHẦN 1/);
    expect(segs[0]).not.toMatch(/preamble/);
  });
});
