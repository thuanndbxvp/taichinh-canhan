# MICRO-STEP EXECUTION WORKFLOW (MSEW): Dọn dẹp Pre-existing Errors

## 1. YÊU CẦU KỸ NĂNG (REQUIRED SKILLS)
- **TypeScript:** Khắc phục các lỗi type definition và import paths bị lệch chuẩn.

## 2. BỐI CẢNH & MỤC TIÊU (CONTEXT & OBJECTIVES)
Trong quá trình triển khai Deep Research, Tầng 2 đã phát hiện một số lỗi Pre-existing (đã có từ trước do các AI khác gây ra nhưng chưa fix triệt để).
Mục tiêu của task này là dọn dẹp sạch sẽ bảng lỗi của CodeGraph, đảm bảo dự án 100% type-safe.

## 3. CÁC BƯỚC THỰC THI CHI TIẾT (EXECUTION STEPS)

### BƯỚC 3.1: Fix lỗi `TopicSuggestionItem` (Missing fields)
- **File:** `types.ts`
- **Hành động:** Thêm 2 optional fields `branch` và `hook` vào interface `TopicSuggestionItem`.
```typescript
export interface TopicSuggestionItem {
    title: string;
    vietnameseTitle?: string;
    outline: string;
    category?: string;
    branch?: string;
    hook?: string;
}
```
*(Lý do: Trong `constants.ts`, mảng `FINANCE_IDEAS` có chứa các field này, nên interface cần được định nghĩa chuẩn xác).*

### BƯỚC 3.2: Fix lỗi đường dẫn import trong `UsagePanel.tsx`
- **File:** `components/UsagePanel.tsx`
- **Hành động:** 
  - `components` đang nằm ở thư mục gốc (ngoài `src`).
  - Đổi dòng `import type { UsageEntry } from '../services/usage/usageTracker';`
  - Thành: `import type { UsageEntry } from '../src/services/usage/usageTracker';`

### BƯỚC 3.3: Fix lỗi import `?raw` trong TSC
- **File:** `types.ts` (hoặc tạo file `env.d.ts` ở root)
- **Hành động:** Thêm module declaration để TypeScript hiểu các cú pháp import file thô của Vite. Chèn vào cuối file `types.ts`:
```typescript
declare module '*?raw' {
  const content: string;
  export default content;
}
```

## 4. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
- [ ] Chạy lệnh build hoặc `tsc --noEmit` không báo bất kỳ lỗi Pre-existing nào.
- [ ] CodeGraph báo sạch 100% (0 errors).
