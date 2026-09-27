import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Trash2 } from 'lucide-react';
import { Student } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, lastYear: string | number | null) => void;
  onDelete?: () => void;
  editingStudent?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingStudent,
}) => {
  const [name, setName] = useState('');
  const [lastYear, setLastYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setLastYear(editingStudent.lastYear !== null ? String(editingStudent.lastYear) : '');
    } else {
      setName('');
      setLastYear('');
    }
    setError('');
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('تکایە ناوی قوتابی بنووسە');
      return;
    }
    onSave(name.trim(), lastYear.trim() !== '' ? lastYear.trim() : null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E4E0D6] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E0D6] mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#2F6B5E]/10 text-[#2F6B5E] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#23291F]">
              {editingStudent ? 'دەستکاری زانیاری قوتابی' : 'زیادکردنی قوتابی نوێ'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7263] hover:text-[#23291F] p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#23291F] mb-1.5">
              ناوی سیانی یان چوارینی قوتابی *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="نموونە: ئاراس کامەران محەمەد"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E0D6] focus:border-[#2F6B5E] focus:ring-2 focus:ring-[#2F6B5E]/20 text-sm outline-hidden transition"
            />
            {error && <p className="text-red-600 text-xs mt-1.5 font-medium">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#23291F] mb-1.5">
              نمرەی ساڵی پار (ئارەزوومەندانە)
            </label>
            <input
              type="text"
              value={lastYear}
              onChange={(e) => setLastYear(e.target.value)}
              placeholder="نموونە: ٩٢ یان ٨٥+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E0D6] focus:border-[#2F6B5E] focus:ring-2 focus:ring-[#2F6B5E]/20 text-sm outline-hidden transition"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E4E0D6] mt-6">
            {editingStudent && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`دڵنیایت لە سڕینەوەی ${editingStudent.name}؟`)) {
                    onDelete();
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                سڕینەوەی قوتابی
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E4E0D6] text-xs font-semibold text-[#6B7263] hover:bg-slate-50 transition-colors"
              >
                پاشگەزبوونەوە
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2F6B5E] hover:bg-[#25574c] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                پاشەکەوتکردن
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
