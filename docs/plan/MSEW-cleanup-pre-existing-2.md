# MICRO-STEP EXECUTION WORKFLOW (MSEW): Dọn dẹp Pre-existing Errors - Round 2

## 1. YÊU CẦU KỸ NĂNG (REQUIRED SKILLS)
- **TypeScript:** Khắc phục lỗi type ở tầng AI Gateway và Unit Tests.

## 2. BỐI CẢNH & MỤC TIÊU (CONTEXT & OBJECTIVES)
Mục tiêu: Quét sạch 17 lỗi pre-existing TypeScript còn sót lại trên CodeGraph do những thay đổi ở các hệ thống cũ. Đưa dự án về 0 lỗi TSC.

## 3. CÁC BƯỚC THỰC THI CHI TIẾT (EXECUTION STEPS)

### BƯỚC 3.1: Fix lỗi Test Data trong `useGenerationWorkflow.test.ts`
- **File:** `src/features/generation/useGenerationWorkflow.test.ts`
- **Hành động:** Thêm 2 thuộc tính `scriptStyle: 'analytical'` và `scriptHook: 'story'` vào các mock data của script hoặc `GenerationParams` để thoả mãn interface mới.

### BƯỚC 3.2: Fix lỗi LibraryItem thiếu `brief`
- **File:** `types.ts`
- **Hành động:** Thêm `brief?: any;` vào interface `LibraryItem`.

### BƯỚC 3.3: Fix lỗi AppErrorCode
- **File:** `src/lib/errors.ts`
- **Hành động:** Thêm `'AI_GENERATION_FAILED'` (và có thể `'ai_generation_failed'` nếu code gọi bị nhầm case) vào type `AppErrorCode`. Cụ thể: chỉnh lại code ở `AiGateway.ts` ném lỗi `'AI_GENERATION_FAILED'` thay vì chữ thường, hoặc thêm cả cụm chữ thường vào Type.

### BƯỚC 3.4: Fix lỗi ProviderErrorKind
- **File:** `src/services/ai/ProviderError.ts`
- **Hành động:** Thêm `'http'` và `'provider'` vào union type `ProviderErrorKind`.

### BƯỚC 3.5: Fix lỗi import trong `router.ts`
- **File:** `src/services/ai/router.ts`
- **Hành động:** Sửa đường dẫn import hàm parse JSON:
  - Cũ: `import { parseAiJsonOrThrow } from './schemas';`
  - Mới: `import { parseAiJsonOrThrow } from './responseParser';`

### BƯỚC 3.6: Loại trừ thư mục Deno khỏi TSC
- **File:** `tsconfig.json`
- **Hành động:** Thêm `"supabase/functions"` vào mảng `"exclude"` ở cuối file để TSC của giao diện không kiểm tra code Deno.
```json
  "exclude": ["node_modules", "dist", "supabase/functions"]
```

## 4. TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)
- [ ] Chạy lệnh `npm run typecheck` (tsc --noEmit) báo thành công, không còn 17 lỗi trên.
- [ ] CodeGraph báo sạch 100% (0 errors).
