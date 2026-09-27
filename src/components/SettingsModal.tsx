import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check } from 'lucide-react';
import { ColumnConfig } from '../types';
import { DEFAULT_COLUMN_CONFIG } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ColumnConfig;
  onSaveConfig: (newConfig: ColumnConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ColumnConfig>({ ...config });

  if (!isOpen) return null;

  const totalActivityTarget =
    formData.hwTarget + formData.quizTarget + formData.behaviorTarget + formData.participationTarget;

  const handleReset = () => {
    setFormData({ ...DEFAULT_COLUMN_CONFIG });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E4E0D6] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E0D6] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#2F6B5E]/10 text-[#2F6B5E] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#23291F]">ڕێکخستنی کێش و نمرەکان</h3>
              <p className="text-xs text-[#6B7263]">دیاریکردنی بەشی هەر چالاکییەک لەسەر کۆی گشتی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7263] hover:text-[#23291F] p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Targets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#23291F] uppercase tracking-wide">
                دابەشکردنی نمرەی چالاکی (کۆی گشتی: {totalActivityTarget})
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  totalActivityTarget === 10
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {totalActivityTarget === 10 ? 'کۆی تەواوە (١٠)' : `کۆی ئێستا: ${totalActivityTarget}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E4E0D6]">
              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  ئەرکی ماڵەوە (لەسەر چەند بێت؟)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.hwTarget}
                  onChange={(e) => setFormData({ ...formData, hwTarget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  کویزەکان (لەسەر چەند بێت؟)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.quizTarget}
                  onChange={(e) => setFormData({ ...formData, quizTarget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  هەڵسوکەوت (لەسەر چەند بێت؟)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.behaviorTarget}
                  onChange={(e) => setFormData({ ...formData, behaviorTarget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  بەشداری ڕۆژانە (لەسەر چەند بێت؟)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.participationTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, participationTarget: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* Max values */}
          <div>
            <span className="block text-xs font-bold text-[#23291F] uppercase tracking-wide mb-2">
              بەرزترین نمرەی تاقیکردنەوە و کویز
            </span>
            <div className="grid grid-cols-2 gap-3 bg-[#FAF8F4] p-3.5 rounded-xl border border-[#E4E0D6]">
              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  کویزی تاقیکراوە (لەسەر چەندە؟)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.quizMax}
                  onChange={(e) => setFormData({ ...formData, quizMax: parseInt(e.target.value, 10) || 10 })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7263] mb-1">
                  تاقیکردنەوەکان (لەسەر چەندە؟)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={formData.examMax}
                  onChange={(e) => setFormData({ ...formData, examMax: parseInt(e.target.value, 10) || 20 })}
                  className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#E4E0D6] text-sm text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E4E0D6]">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6B7263] hover:text-[#23291F] hover:bg-slate-100 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              گەڕانەوە بۆ باری بنەڕەتی
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E4E0D6] text-xs font-semibold text-[#6B7263] hover:bg-slate-50 transition"
              >
                داخستن
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2F6B5E] hover:bg-[#25574c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Check className="w-4 h-4" />
                جێبەجێکردن
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
