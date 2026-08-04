# MICRO-STEP EXECUTION WORKFLOW (MSEW): Track 1 - Phase 4 (UI Components)

---

### BƯỚC 1: Cập nhật `components/ControlPanel.tsx`
- **File:** `components/ControlPanel.tsx`
- **Thực hiện:**
  1. Thêm import:
     ```typescript
     import { determineToleranceMode, type ToleranceMode } from '../src/domain/wordCount';
     import type { OutlineEstimation } from '../src/features/generation/useGenerationWorkflow';
     ```
  2. Thêm vào `ControlPanelProps`:
     ```typescript
     outlineEstimation?: OutlineEstimation | null;
     ```
  3. Định nghĩa mảng Presets:
     ```typescript
     const WORD_COUNT_PRESETS = [
       { label: '600 từ (Ngắn - 3\')', value: '600', duration: '~3 phút' },
       { label: '1200 từ (Chuẩn - 6-7\')', value: '1200', duration: '~6-7 phút' },
       { label: '1800 từ (Chuyên sâu - 10\')', value: '1800', duration: '~10 phút', recommended: true },
       { label: '2400 từ (Chi tiết - 13-14\')', value: '2400', duration: '~13-14 phút' },
     ];
     ```
  4. Thay thế toàn bộ thẻ `<ControlSection title="2. Cấu trúc & Định dạng" ...>` cũ:
     ```tsx
     <ControlSection title="2. Cấu trúc & Dung lượng Kịch bản" isDark>
       <div className="space-y-3">
         {/* Khung Gợi Ý Từ AI khi có Outline Estimation */}
         {outlineEstimation && (
           <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-200">
             <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
               <span>💡 Gợi ý AI:</span>
               <span>Tối thiểu {outlineEstimation.minRecommendedWords.toLocaleString()} từ (Lý tưởng: {outlineEstimation.optimalWords.toLocaleString()} từ)</span>
             </div>
             <p className="text-emerald-300/80">{outlineEstimation.reason}</p>
           </div>
         )}

         <div>
           <div className="flex justify-between items-center mb-1.5">
             <label htmlFor="wordCount" className="text-xs font-medium text-text-secondary">
               Tổng số từ mục tiêu
             </label>
             {outlineContent && (
               <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 border border-emerald-900/40">
                 {determineToleranceMode(outlineContent, parseInt(wordCount, 10) || 1800, outlineEstimation?.minRecommendedWords ?? 0) === 'flexible'
                   ? '⚡ Linh hoạt (±20%)'
                   : '🎯 Chuẩn mực (±5%)'}
               </span>
             )}
           </div>

           {/* Preset Buttons */}
           <div className="grid grid-cols-2 gap-1.5 mb-2.5">
             {WORD_COUNT_PRESETS.map((preset) => {
               const isSelected = wordCount === preset.value;
               return (
                 <button
                   key={preset.value}
                   type="button"
                   onClick={() => setWordCount(preset.value)}
                   className={`px-2.5 py-1.5 text-xs rounded-md border text-left transition-all ${
                     isSelected
                       ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold shadow-sm'
                       : 'border-emerald-900/30 bg-black/40 text-emerald-100/70 hover:bg-emerald-950/40 hover:text-emerald-200'
                   }`}
                   title={preset.duration}
                 >
                   <div className="flex items-center justify-between">
                     <span>{preset.label}</span>
                     {preset.recommended && <span className="text-amber-400 text-[10px]">⭐</span>}
                   </div>
                 </button>
               );
             })}
           </div>

           {/* Input số từ tùy chỉnh */}
           <input
             id="wordCount"
             type="number"
             value={wordCount}
             onChange={(e) => setWordCount(e.target.value)}
             min={100}
             max={10000}
             step={100}
             className="w-full border rounded-md p-2 text-sm bg-black border-emerald-900/50 text-emerald-100 focus:ring-1 focus:ring-emerald-500 outline-none"
             placeholder="VD: 1800"
           />

           {/* Ước tính thời lượng đọc */}
           {parseInt(wordCount, 10) > 0 && (
             <div className="mt-1.5 text-[11px] text-emerald-400/60 flex items-center justify-between">
               <span>⏱️ Ước tính thời lượng: ~{Math.round((parseInt(wordCount, 10) || 0) / 180)} phút</span>
               <span>(Tốc độ 180 WPM)</span>
             </div>
           )}

           {/* Cảnh báo nếu nhập dưới mức tối thiểu mà không có yêu cầu ngắn */}
           {outlineEstimation && parseInt(wordCount, 10) < outlineEstimation.minRecommendedWords && (
             <div className="mt-2 p-2 rounded bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90">
               ⚠️ Bạn đang đặt số từ thấp hơn mức khuyến nghị ({outlineEstimation.minRecommendedWords} từ). Nội dung bài toán số liệu có thể bị rút gọn.
             </div>
           )}
         </div>
       </div>
     </ControlSection>
     ```

---

### BƯỚC 2: Cập nhật `components/OutputDisplay.tsx`
- **File:** `components/OutputDisplay.tsx`
- **Thực hiện:**
  1. Thêm import:
     ```typescript
     import {
       countWords,
       getWordCountTolerance,
       isWithinTolerance,
       formatWordCount,
       determineToleranceMode,
     } from '../src/domain/wordCount';
     import type { OutlineEstimation } from '../src/features/generation/useGenerationWorkflow';
     ```
  2. Thêm vào `OutputDisplayProps`:
     ```typescript
     targetWordCount?: string;
     outlineEstimation?: OutlineEstimation | null;
     userDescription?: string;
     ```
  3. Render Badge Word Count phía trên khu vực hiển thị kịch bản (khi `script` có nội dung và không phải chỉ là Dàn ý):
     ```tsx
     {script && !isOutlinePhase && (
       <div className="flex items-center justify-between py-2 px-3 mb-3 rounded-lg bg-zinc-900/80 border border-emerald-900/40 text-xs">
         {(() => {
           const targetNum = parseInt(targetWordCount || '1800', 10) || 1800;
           const mode = determineToleranceMode(
             userDescription || '',
             targetNum,
             outlineEstimation?.minRecommendedWords ?? 0
           );
           const tolerance = getWordCountTolerance(targetNum, mode);
           const actualWords = countWords(script);
           const isOk = isWithinTolerance(actualWords, tolerance);

           return (
             <div className="flex items-center gap-2">
               <span className="font-semibold text-emerald-400">📊 Kiểm soát dung lượng:</span>
               <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                 isOk ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
               }`}>
                 {formatWordCount(actualWords, tolerance)}
               </span>
             </div>
           );
         })()}
       </div>
     )}
     ```

---

### BƯỚC 3: Nối Props trong `App.tsx`
- **File:** `App.tsx`
- Truyền `outlineEstimation={workflow.outlineEstimation}` vào `<ControlPanel />` và `<OutputDisplay />`.
- Truyền `targetWordCount={brief.wordCount}` và `userDescription={brief.outlineContent}` vào `<OutputDisplay />`.
