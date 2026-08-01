# PLAN: Rewrite Script & Trọng Số

## Kiến trúc thay đổi
1. **Prompts (`src/services/ai/prompts/index.ts`):** 
   - Fix bug font (Mojibake).
   - Thêm luật cứng: Title là xương sống, OutlineContent (Mô tả) chỉ là ý phụ.
   - Thêm luật ép cấu trúc 5 phần (nếu là Level 2 Rewrite) vào `finance.script.revise`.
2. **UI Tạo Mới (`components/ControlPanel.tsx`):**
   - Giới hạn `maxLength={800}` cho textarea Mô tả. Thêm text cảnh báo hướng dẫn dùng Rewrite Mode.
3. **UI Rewrite Mode (`components/RewriteModal.tsx` & `App.tsx`):**
   - Tạo FAB button "♻️ Tẩy rửa kịch bản" ở App.tsx (hoặc ControlPanel).
   - Modal toàn màn hình chia 2 cột: Trái (Original), Phải (Rewritten).
   - Có Select Box chọn mức độ: "Sửa văn phong" (Mức 1) và "Gò lại 5 bước" (Mức 2).
4. **Logic (`src/features/generation/useGenerationWorkflow.ts`):**
   - Thêm `rewriteScript(title, originalScript, level)`. Hàm này gọi `classifyTopic` lấy Branch/Hook, sau đó tự sinh `revisionPrompt` dựa vào level, và gọi `finance.script.revise`.
