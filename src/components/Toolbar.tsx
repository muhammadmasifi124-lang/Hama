import React from 'react';
import { Search, Plus, Minus, RotateCcw, CheckSquare, Sparkles } from 'lucide-react';
import { ColumnConfig } from '../types';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: 'all' | 'pass' | 'risk' | 'unmarked';
  onFilterChange: (f: 'all' | 'pass' | 'risk' | 'unmarked') => void;
  config: ColumnConfig;
  onUpdateCount: (type: 'hw' | 'quiz' | 'behavior' | 'participation' | 'exam', delta: number) => void;
  onResetClassGrades: () => void;
  onFillAllHW: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  config,
  onUpdateCount,
  onResetClassGrades,
  onFillAllHW,
}) => {
  return (
    <div className="space-y-3 mb-4">
      {/* Search and Filters row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E4E0D6] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6B7263] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="گەڕان بەدوای ناوی قوتابی..."
            className="w-full pl-3 pr-9 py-2 bg-[#FAF8F4] border border-[#E4E0D6] focus:border-[#2F6B5E] focus:ring-1 focus:ring-[#2F6B5E] rounded-lg text-xs outline-hidden transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6B7263] hover:text-[#23291F]"
            >
              سڕینەوە
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <span className="text-[#6B7263] text-xs shrink-0 ml-1">فلتەر:</span>
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              filterStatus === 'all'
                ? 'bg-[#2F6B5E] text-white shadow-xs'
                : 'text-[#6B7263] hover:bg-slate-100'
            }`}
          >
            هەمووان
          </button>
          <button
            onClick={() => onFilterChange('pass')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              filterStatus === 'pass'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-[#6B7263] hover:bg-slate-100'
            }`}
          >
            دەرچووەکان (≥١٥ لە ٣٠)
          </button>
          <button
            onClick={() => onFilterChange('risk')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              filterStatus === 'risk'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-[#6B7263] hover:bg-slate-100'
            }`}
          >
            پێویست بە سەرنج (&lt;١٥)
          </button>
          <button
            onClick={() => onFilterChange('unmarked')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
              filterStatus === 'unmarked'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-[#6B7263] hover:bg-slate-100'
            }`}
          >
            نمرە دانەنراوەکان
          </button>
        </div>
      </div>

      {/* Column counters & Quick operations */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Slot adjusters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#6B7263] font-semibold text-xs ml-1">ژمارەی ستوونەکان:</span>

          {/* HW */}
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D6] rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[#6B7263]">ئەرک:</span>
            <button
              onClick={() => onUpdateCount('hw', -1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="کەمکردنەوەی ستوونی ئەرک"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold min-w-[16px] text-center">{config.hwCount}</span>
            <button
              onClick={() => onUpdateCount('hw', 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="زیادکردنی ستوونی ئەرک"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quiz */}
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D6] rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[#6B7263]">کویز:</span>
            <button
              onClick={() => onUpdateCount('quiz', -1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="کەمکردنەوەی ستوونی کویز"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold min-w-[16px] text-center">{config.quizCount}</span>
            <button
              onClick={() => onUpdateCount('quiz', 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="زیادکردنی ستوونی کویز"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Behavior */}
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D6] rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[#6B7263]">هەڵسوکەوت:</span>
            <button
              onClick={() => onUpdateCount('behavior', -1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="کەمکردنەوەی ستوونی هەڵسوکەوت"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold min-w-[16px] text-center">{config.behaviorCount}</span>
            <button
              onClick={() => onUpdateCount('behavior', 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="زیادکردنی ستوونی هەڵسوکەوت"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Participation */}
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D6] rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[#6B7263]">بەشداری:</span>
            <button
              onClick={() => onUpdateCount('participation', -1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="کەمکردنەوەی ستوونی بەشداری"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold min-w-[16px] text-center">{config.participationCount}</span>
            <button
              onClick={() => onUpdateCount('participation', 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="زیادکردنی ستوونی بەشداری"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Exam */}
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D6] rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[#6B7263]">تاقیکردنەوە:</span>
            <button
              onClick={() => onUpdateCount('exam', -1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="کەمکردنەوەی ستوونی تاقیکردنەوە"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold min-w-[16px] text-center">{config.examCount}</span>
            <button
              onClick={() => onUpdateCount('exam', 1)}
              className="w-5 h-5 flex items-center justify-center rounded bg-[#FAF8F4] text-[#2F6B5E] hover:bg-[#2F6B5E] hover:text-white transition cursor-pointer"
              title="زیادکردنی ستوونی تاقیکردنەوە"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFillAllHW}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="نیشانکردنی ئەرکی ئەمڕۆ وەک ئەنجامدراو بۆ هەموو قوتابیان"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            پڕکردنەوەی خێرای ئەرک
          </button>

          <button
            onClick={onResetClassGrades}
            className="px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="سڕینەوەی هەموو نمرە تۆمارکراوەکانی ئەم پۆلە"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            سڕینەوەی نمرەکان
          </button>
        </div>
      </div>

      {/* Guide Note & Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-[#6B7263] bg-[#FAF8F4] px-3 py-2 rounded-lg border border-[#E4E0D6]/80">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-medium text-[#23291F]">ڕێبەری نیشانەکان:</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>باش / ئەنجامدراو</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">✗</span>
            <span>نەکراو / لاواز</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#ECEAE3] border border-[#D3CFC3] inline-block"></span>
            <span>تۆمارنەکراو (کلیک بکە بۆ گۆڕین)</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#2F6B5E] font-medium mt-1 sm:mt-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>پشتیوانی ژمارەی کوردی (١، ٢، ٣) و ئینگلیزی (1, 2, 3)</span>
        </div>
      </div>
    </div>
  );
};
