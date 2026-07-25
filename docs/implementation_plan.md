# Kế hoạch Refactor AI Provider & Round-Robin

Mục tiêu: Đưa toàn bộ cấu hình AI (chọn Provider, chọn Model) vào trong Modal Quản lý API Keys để giao diện chính (ControlPanel) gọn gàng hơn. Đồng thời hỗ trợ chọn NHIỀU provider cùng lúc và xoay vòng (Round-Robin).

## User Review Required

> [!IMPORTANT]
> Vui lòng xác nhận logic Round-Robin:
> Nên xoay vòng **theo từng lượt bấm tạo kịch bản** (Ví dụ: Bạn bấm tạo kịch bản 1 -> dùng toàn bộ Kyma; Bạn bấm tạo kịch bản 2 -> dùng toàn bộ OpenAI), HAY xoay vòng **theo từng call API bên dưới** (Ví dụ: Dàn ý dùng Kyma, Phần 1 dùng OpenAI, Phần 2 dùng Kyma)?
> 
> *Khuyến nghị:* Nên xoay vòng **theo từng lượt tạo kịch bản** (Mỗi khi bắt đầu một quy trình tạo, lấy 1 provider và dùng nó cho đến khi xong kịch bản đó) để văn phong của kịch bản được nhất quán, không bị "đầu Ngô mình Sở" do 2 AI khác nhau viết.

## Proposed Changes

### `src/features/settings/useAiSettings.ts`
- **[MODIFY]**: 
  - Thay thế state `aiProvider` (string) thành `activeProviders` (mảng string: `['kyma']` hoặc `['openai']` hoặc cả 2).
  - Thay thế `selectedModel` thành `models` dạng Object: `{ kyma: string, openai: string }`.
  - Thêm một ref `roundRobinIndex` để theo dõi thứ tự.
  - Thêm hàm `getNextAiConfig()`: mỗi khi được gọi, hàm này sẽ trả về provider tiếp theo trong mảng `activeProviders` và model tương ứng, đồng thời tăng `roundRobinIndex`.

### `components/ApiKeyModal.tsx`
- **[MODIFY]**:
  - **Đồng bộ UI nhập Key**: Sửa lại phần nhập API Key của Kyma để giống hệt OpenAI (dùng textarea nhập nhiều key một lúc, có nút "Thêm danh sách", hiển thị danh sách các key đã lưu ở bên dưới và có nút Xóa thùng rác cho từng key).
  - Giao diện thêm 1 Checkbox/Toggle "Kích hoạt sử dụng" cho từng panel (Kyma và OpenAI) để quyết định tham gia Round-Robin.
  - Ở panel Kyma, thêm 1 dropdown chọn Model (sẽ gọi API fetch danh sách model giống như bên ControlPanel cũ, lưu vào `models.kyma`).
  - Giao diện trực quan báo cho người dùng biết "Bạn đang bật Round-Robin" nếu cả 2 được tick.

### `components/ControlPanel.tsx`
- **[MODIFY]**: 
  - Xóa toàn bộ Section "2. Cấu hình AI" (gồm các Dropdown chọn AI Provider và Model).
  - Các phần logic fetch model Kyma sẽ được dời sang `ApiKeyModal.tsx`.

### `App.tsx` & Các Workflows (`useGenerationWorkflow`, `useSceneWorkflow`, v.v.)
- **[MODIFY]**: 
  - Ở `App.tsx`, thay vì truyền `aiProvider` và `selectedModel` cố định xuống các hooks, ta sẽ truyền hàm `getNextAiConfig`.
  - Trong `useGenerationWorkflow`, trước khi bắt đầu tạo Dàn Ý (hàm `handleGenerateScript`), hệ thống sẽ gọi `getNextAiConfig()` để lấy ra `provider` & `model` sẽ chịu trách nhiệm cho TOÀN BỘ kịch bản đợt này, và lưu vào state tạm của workflow.

## Verification Plan

- [ ] Mở App, mở modal Setting: Bật cả 2 Provider.
- [ ] Chọn model cho Kyma và OpenAI.
- [ ] Bấm Tạo kịch bản lần 1 -> Quan sát console log/network xem gọi qua Kyma hay OpenAI.
- [ ] Bấm Tạo kịch bản lần 2 -> Phải gọi qua hệ thống còn lại.
- [ ] Tắt 1 hệ thống đi -> Hệ thống còn lại đảm nhiệm 100% request.
