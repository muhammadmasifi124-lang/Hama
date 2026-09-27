import React, { useState } from 'react';
import {
  GraduationCap,
  Printer,
  Download,
  Settings,
  UserPlus,
  Plus,
  CheckCircle2,
  Edit3,
  Tablet,
} from 'lucide-react';
import { ClassData } from '../types';

interface HeaderProps {
  classes: ClassData[];
  activeClassId: string;
  onSelectClass: (id: string) => void;
  onAddClass: (className: string) => void;
  onAddStudent: () => void;
  onOpenSettings: () => void;
  onOpenInstallModal: () => void;
  onExportCSV: () => void;
  onPrint: () => void;
  subjectName: string;
  onUpdateSubjectName: (name: string) => void;
  teacherName: string;
  onUpdateTeacherName: (name: string) => void;
  lastSavedTime: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  classes,
  activeClassId,
  onSelectClass,
  onAddClass,
  onAddStudent,
  onOpenSettings,
  onOpenInstallModal,
  onExportCSV,
  onPrint,
  subjectName,
  onUpdateSubjectName,
  teacherName,
  onUpdateTeacherName,
  lastSavedTime,
}) => {
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    onAddClass(newClassName.trim());
    setNewClassName('');
    setIsAddingClass(false);
  };

  return (
    <header className="mb-5 space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E4E0D6] shadow-xs">
        {/* Branding & Titles */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#2F6B5E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-black text-[#2F6B5E] tracking-tight">
                تۆماری نمرەی قوتابیان
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                پاشەکەوتی خۆکار
              </span>
            </div>

            {/* Editable Subject & Teacher info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7263] mt-1 font-medium">
              {isEditingMeta ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => onUpdateSubjectName(e.target.value)}
                    placeholder="ناوی وانە"
                    className="px-2 py-1 bg-[#FAF8F4] border border-[#E4E0D6] rounded text-xs"
                  />
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => onUpdateTeacherName(e.target.value)}
                    placeholder="ناوی مامۆستا"
                    className="px-2 py-1 bg-[#FAF8F4] border border-[#E4E0D6] rounded text-xs"
                  />
                  <button
                    onClick={() => setIsEditingMeta(false)}
                    className="px-2.5 py-1 bg-[#2F6B5E] text-white rounded text-[11px] font-bold"
                  >
                    تەواو
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditingMeta(true)}>
                  <span>وانە: <strong className="text-[#23291F]">{subjectName}</strong></span>
                  <span>·</span>
                  <span>مامۆستا: <strong className="text-[#23291F]">{teacherName}</strong></span>
                  <Edit3 className="w-3 h-3 text-[#6B7263] group-hover:text-[#2F6B5E]" />
                </div>
              )}

              {lastSavedTime && (
                <span className="text-[11px] text-[#6B7263]/70 hidden md:inline">
                  (دواین نوێبوونەوە: {(() => {
                    try {
                      return lastSavedTime.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
                    } catch (e) {
                      return lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                  })()})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={onOpenInstallModal}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="خستنەسەر شاشەی سەرەکی ئایپاد بۆ بەکارهێنان لە پۆل"
          >
            <Tablet className="w-4 h-4 text-amber-700" />
            <span>خستنەسەر شاشەی ئایپاد</span>
          </button>

          <button
            onClick={onAddStudent}
            className="px-3.5 py-2 bg-[#2F6B5E] hover:bg-[#26574c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>قوتابی نوێ</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-[#23291F] border border-[#E4E0D6] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            title="چاپکردن یان دابەزاندنی PDF"
          >
            <Printer className="w-4 h-4 text-[#6B7263]" />
            <span className="hidden sm:inline">چاپ / PDF</span>
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-[#23291F] border border-[#E4E0D6] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            title="دابەزاندنی شیت وەک فایلی Excel / CSV"
          >
            <Download className="w-4 h-4 text-[#6B7263]" />
            <span className="hidden sm:inline">فایلی Excel</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 bg-white hover:bg-slate-50 text-[#6B7263] hover:text-[#23291F] border border-[#E4E0D6] rounded-xl transition cursor-pointer"
            title="ڕێکخستنی نمرە و کێشەکان"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Class Selection Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-print">
        <div className="flex items-center gap-2">
          {classes.map((cls) => {
            const isActive = cls.id === activeClassId;
            return (
              <button
                key={cls.id}
                onClick={() => onSelectClass(cls.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2F6B5E] text-white shadow-xs'
                    : 'bg-white text-[#6B7263] border border-[#E4E0D6] hover:bg-[#FAF8F4] hover:text-[#23291F]'
                }`}
              >
                <span>{cls.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#6B7263]'
                  }`}
                >
                  {cls.students.length}
                </span>
              </button>
            );
          })}

          {/* Add Class button or form */}
          {isAddingClass ? (
            <form onSubmit={handleCreateClass} className="flex items-center gap-1.5">
              <input
                type="text"
                autoFocus
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="ناوی پۆل (نموونە: پۆلی E)"
                className="px-2.5 py-1.5 bg-white border border-[#2F6B5E] rounded-xl text-xs outline-hidden"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 bg-[#2F6B5E] text-white rounded-xl text-xs font-bold"
              >
                زیادکردن
              </button>
              <button
                type="button"
                onClick={() => setIsAddingClass(false)}
                className="px-2 py-1.5 text-xs text-[#6B7263]"
              >
                پاشگەزبوونەوە
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingClass(true)}
              className="px-3 py-2 bg-white/70 hover:bg-white text-[#6B7263] hover:text-[#2F6B5E] border border-dashed border-[#C8C3B7] hover:border-[#2F6B5E] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>پۆلی نوێ</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
