import React, { useState, useEffect } from 'react';

interface MissingDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: string;
  placeholders: string[];
  onApply: (newScript: string) => void;
}

export const extractPlaceholders = (text: string): string[] => {
  if (!text) return [];
  const regex = /\[CẦN ĐIỀN[^\]]*\]/gi;
  const matches = text.match(regex);
  if (!matches) return [];
  // Remove duplicates
  return Array.from(new Set(matches));
};

export const MissingDataModal: React.FC<MissingDataModalProps> = ({
  isOpen,
  onClose,
  script,
  placeholders,
  onApply,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, string> = {};
      placeholders.forEach((p) => {
        initial[p] = '';
      });
      setFormData(initial);
    }
  }, [isOpen, placeholders]);

  const handleChange = (placeholder: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [placeholder]: value,
    }));
  };

  const handleApply = () => {
    let newScript = script;
    for (const placeholder of placeholders) {
      const value = formData[placeholder];
      if (value && value.trim() !== '') {
        // Replace all occurrences of this placeholder
        // Use a global regex to replace all, escaping special characters in placeholder
        const escapedPlaceholder = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedPlaceholder, 'g');
        newScript = newScript.replace(regex, value.trim());
      }
    }
    onApply(newScript);
    onClose();
  };

  // Check if at least one field is filled
  const hasInput = Object.values(formData).some((v) => v.trim() !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e1e2e] border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary">
          <h2 className="text-xl font-bold text-text-primary">Điền dữ liệu còn thiếu</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-4">
          <p className="text-sm text-text-secondary">
            AI đã chừa lại {placeholders.length} biến số chưa có dữ liệu thực tế. Vui lòng nhập số liệu để hoàn thiện Dàn ý trước khi tạo kịch bản.
          </p>

          <div className="space-y-3">
            {placeholders.map((placeholder, idx) => {
              // Lược bỏ bớt chữ "CẦN ĐIỀN " hoặc "CẦN ĐIỀN CHÍNH XÁC " để hiển thị label ngắn gọn hơn
              let label = placeholder.replace(/\[|\]/g, '');
              label = label.replace(/CẦN ĐIỀN CHÍNH XÁC /gi, '');
              label = label.replace(/CẦN ĐIỀN /gi, '');

              return (
                <div key={idx} className="space-y-1">
                  <label className="text-sm font-semibold text-text-primary capitalize">{label}</label>
                  <input
                    type="text"
                    className="w-full bg-black/40 text-white placeholder-gray-500 px-3 py-2 border border-border rounded-md focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm"
                    placeholder="Nhập giá trị thật..."
                    value={formData[placeholder] || ''}
                    onChange={(e) => handleChange(placeholder, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 flex justify-end gap-3 border-t border-border bg-secondary">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-text-primary rounded-md font-semibold hover:bg-primary/50 transition border border-border"
          >
            Hủy
          </button>
          <button
            onClick={handleApply}
            disabled={!hasInput}
            className="px-4 py-2 bg-accent text-white rounded-md font-bold hover:brightness-110 transition shadow-md shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
