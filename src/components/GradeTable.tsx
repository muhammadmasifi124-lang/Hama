import React, { useRef } from 'react';
import { Check, X as CloseIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Student, StudentGrades, ColumnConfig, ToggleState } from '../types';
import {
  parseKurdishNumber,
  formatNum,
  calculateActivity10,
  calculateExamScore,
  calculateMonthlyTotal30,
} from '../utils/numberParser';

interface GradeTableProps {
  students: Student[];
  grades: Record<string, StudentGrades>;
  config: ColumnConfig;
  onUpdateToggle: (
    studentId: string,
    type: 'hw' | 'behavior' | 'participation',
    index: number
  ) => void;
  onUpdateNumber: (
    studentId: string,
    type: 'quiz' | 'exams',
    index: number,
    value: number | null
  ) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  students,
  grades,
  config,
  onUpdateToggle,
  onUpdateNumber,
  onEditStudent,
  onDeleteStudent,
}) => {
  // Store refs to numeric input elements for arrow key navigation: matrix [rowIdx][colKey]
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number,
    colKey: string
  ) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextKey = `${rowIdx + 1}-${colKey}`;
      const nextInput = inputRefs.current.get(nextKey);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevKey = `${rowIdx - 1}-${colKey}`;
      const prevInput = inputRefs.current.get(prevKey);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  const getScoreColorClass = (score: number, max: number) => {
    if (score === 0) return 'text-[#6B7263]';
    const ratio = score / max;
    if (ratio >= 0.7) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (ratio >= 0.5) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-red-50 text-red-800 border-red-200';
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E4E0D6] p-12 text-center text-[#6B7263]">
        <p className="text-base font-bold text-[#23291F] mb-1">هیچ قوتابییەک نەدۆزرایەوە</p>
        <p className="text-xs">تکایە ناوی نوێ بنووسە یان فلتەرەکەت بگۆڕە.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap bg-white rounded-2xl border border-[#E4E0D6] shadow-xs overflow-x-auto relative">
      <table className="w-full text-xs border-collapse min-w-[1000px]">
        {/* Table Header */}
        <thead>
          {/* Top category spanning row */}
          <tr className="bg-[#FAF8F4] text-[#2F6B5E] text-[11px] font-bold border-b border-[#E4E0D6]">
            <th colSpan={3} className="py-2.5 px-3 border-l border-[#E4E0D6] text-right">
              زانیاری قوتابی
            </th>

            {/* Homework Group */}
            <th
              colSpan={config.hwCount}
              className="py-2.5 px-1 text-center border-l border-[#E4E0D6] bg-emerald-50/60"
            >
              ئەرکی ماڵەوە (لەسەر {config.hwTarget})
            </th>

            {/* Quiz Group */}
            <th
              colSpan={config.quizCount}
              className="py-2.5 px-1 text-center border-l border-[#E4E0D6] bg-blue-50/60"
            >
              کویزەکان (لەسەر {config.quizTarget})
            </th>

            {/* Behavior Group */}
            <th
              colSpan={config.behaviorCount}
              className="py-2.5 px-1 text-center border-l border-[#E4E0D6] bg-amber-50/60"
            >
              هەڵسوکەوت (لەسەر {config.behaviorTarget})
            </th>

            {/* Participation Group */}
            <th
              colSpan={config.participationCount}
              className="py-2.5 px-1 text-center border-l border-[#E4E0D6] bg-purple-50/60"
            >
              بەشداری ڕۆژانە (لەسەر {config.participationTarget})
            </th>

            {/* Activity Total */}
            <th className="py-2.5 px-2 text-center border-l border-[#E4E0D6] bg-emerald-100/70 text-emerald-900 font-extrabold">
              کۆی چالاکی (١٠)
            </th>

            {/* Exams Group */}
            <th
              colSpan={config.examCount}
              className="py-2.5 px-1 text-center border-l border-[#E4E0D6] bg-teal-50/60 text-teal-900"
            >
              تاقیکردنەوەکان (لەسەر {config.examMax})
            </th>

            {/* Exam Average */}
            <th className="py-2.5 px-2 text-center border-l border-[#E4E0D6] bg-teal-100/70 text-teal-900 font-extrabold">
              تێکڕای تاقیکردنەوە (٢٠)
            </th>

            {/* Final Monthly Total */}
            <th className="py-2.5 px-3 text-center bg-[#2F6B5E] text-white font-extrabold">
              کۆی مانگانە (٣٠)
            </th>

            <th className="py-2.5 px-2 text-center no-print">کردار</th>
          </tr>

          {/* Sub headers row with column numbers */}
          <tr className="bg-white border-b-2 border-[#E4E0D6] text-[#23291F] font-bold text-[11px]">
            <th className="py-2 px-2 text-center w-8 text-[#6B7263]">#</th>
            <th className="py-2 px-3 text-right sticky right-0 bg-white z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.02)] min-w-[160px]">
              ناوی قوتابی
            </th>
            <th className="py-2 px-2 text-center text-[#B8863B] w-14 border-l border-[#E4E0D6]">
              نمرەی پار
            </th>

            {/* HW columns */}
            {Array.from({ length: config.hwCount }).map((_, i) => (
              <th key={`hw-h-${i}`} className="py-2 px-1 text-center w-8 font-medium text-[#6B7263]">
                {i + 1}
              </th>
            ))}

            {/* Quiz columns */}
            {Array.from({ length: config.quizCount }).map((_, i) => (
              <th key={`quiz-h-${i}`} className="py-2 px-1 text-center w-11 font-medium text-[#6B7263]">
                ق{i + 1}
              </th>
            ))}

            {/* Behavior columns */}
            {Array.from({ length: config.behaviorCount }).map((_, i) => (
              <th key={`beh-h-${i}`} className="py-2 px-1 text-center w-8 font-medium text-[#6B7263]">
                {i + 1}
              </th>
            ))}

            {/* Participation columns */}
            {Array.from({ length: config.participationCount }).map((_, i) => (
              <th key={`part-h-${i}`} className="py-2 px-1 text-center w-8 font-medium text-[#6B7263]">
                {i + 1}
              </th>
            ))}

            {/* Total 10 column */}
            <th className="py-2 px-2 text-center w-14 text-emerald-900 border-l border-[#E4E0D6]">
              ١٠
            </th>

            {/* Exam columns */}
            {Array.from({ length: config.examCount }).map((_, i) => (
              <th key={`exam-h-${i}`} className="py-2 px-1 text-center w-12 font-medium text-[#6B7263]">
                ت{i + 1}
              </th>
            ))}

            {/* Exam Average */}
            <th className="py-2 px-2 text-center w-14 text-teal-900 border-l border-[#E4E0D6]">
              ٢٠
            </th>

            {/* Monthly Total 30 */}
            <th className="py-2 px-3 text-center w-16 text-[#2F6B5E] font-black">
              ٣٠
            </th>

            <th className="py-2 px-2 text-center w-10 no-print"></th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#E4E0D6]/70">
          {students.map((student, rowIdx) => {
            const rawGrades = grades[student.id];
            const sGrades = {
              hw: Array.isArray(rawGrades?.hw) ? rawGrades.hw : [],
              quiz: Array.isArray(rawGrades?.quiz) ? rawGrades.quiz : [],
              behavior: Array.isArray(rawGrades?.behavior) ? rawGrades.behavior : [],
              participation: Array.isArray(rawGrades?.participation) ? rawGrades.participation : [],
              exams: Array.isArray(rawGrades?.exams) ? rawGrades.exams : [],
            };

            const act = calculateActivity10(sGrades, config);
            const exam = calculateExamScore(sGrades.exams, config.examMax);
            const monthlyTotal = calculateMonthlyTotal30(act.total10, exam.average);
            const isPassing = monthlyTotal >= 15;

            return (
              <tr
                key={student.id}
                className="hover:bg-[#FAF8F4]/80 transition-colors group"
              >
                {/* # */}
                <td className="py-2 px-2 text-center text-[#6B7263] font-medium">
                  {rowIdx + 1}
                </td>

                {/* Student Name (Sticky on right in RTL) */}
                <td className="py-2 px-3 text-right font-bold text-[#23291F] sticky right-0 bg-white group-hover:bg-[#FAF8F4] z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.02)] whitespace-nowrap">
                  <span className="cursor-pointer hover:text-[#2F6B5E]" onClick={() => onEditStudent(student)}>
                    {student.name}
                  </span>
                </td>

                {/* Last Year */}
                <td className="py-2 px-2 text-center border-l border-[#E4E0D6] text-[#B8863B] font-semibold">
                  {student.lastYear !== null ? String(student.lastYear) : '—'}
                </td>

                {/* Homework Cells (Toggle) */}
                {Array.from({ length: config.hwCount }).map((_, i) => {
                  const stateVal: ToggleState = sGrades.hw[i] ?? 0;
                  return (
                    <td key={`hw-${i}`} className="py-1.5 px-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => onUpdateToggle(student.id, 'hw', i)}
                        title="کلیک بکە: باش ✓ / لاواز ✗ / پاککردنەوە"
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer mx-auto text-xs ${
                          stateVal === 1
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold scale-105'
                            : stateVal === 2
                            ? 'bg-red-500 text-white shadow-2xs font-bold scale-105'
                            : 'bg-[#ECEAE3] text-transparent hover:bg-slate-200 border border-[#D3CFC3]'
                        }`}
                      >
                        {stateVal === 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stateVal === 2 ? <CloseIcon className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                      </button>
                    </td>
                  );
                })}

                {/* Quiz Cells (Numeric out of quizMax, accepts Kurdish & English digits) */}
                {Array.from({ length: config.quizCount }).map((_, i) => {
                  const val = sGrades.quiz[i];
                  const colKey = `quiz-${i}`;
                  const refKey = `${rowIdx}-${colKey}`;
                  return (
                    <td key={colKey} className="py-1.5 px-0.5 text-center">
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(refKey, el);
                          else inputRefs.current.delete(refKey);
                        }}
                        type="text"
                        inputMode="decimal"
                        value={val !== null && val !== undefined ? String(val) : ''}
                        placeholder="—"
                        onChange={(e) => {
                          const parsed = parseKurdishNumber(e.target.value);
                          if (parsed === null) {
                            onUpdateNumber(student.id, 'quiz', i, null);
                          } else {
                            const clamped = Math.min(Math.max(parsed, 0), config.quizMax);
                            onUpdateNumber(student.id, 'quiz', i, clamped);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colKey)}
                        className={`w-10 h-7 text-center rounded-md font-semibold text-xs border border-[#E4E0D6] focus:border-[#2F6B5E] focus:ring-1 focus:ring-[#2F6B5E] outline-hidden transition ${
                          val !== null
                            ? val >= config.quizMax * 0.7
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                              : val >= config.quizMax * 0.4
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-red-50 text-red-900 border-red-300'
                            : 'bg-white text-[#23291F]'
                        }`}
                      />
                    </td>
                  );
                })}

                {/* Behavior Cells (Toggle) */}
                {Array.from({ length: config.behaviorCount }).map((_, i) => {
                  const stateVal: ToggleState = sGrades.behavior[i] ?? 0;
                  return (
                    <td key={`beh-${i}`} className="py-1.5 px-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => onUpdateToggle(student.id, 'behavior', i)}
                        title="کلیک بکە: باش ✓ / لاواز ✗ / پاککردنەوە"
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer mx-auto text-xs ${
                          stateVal === 1
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold scale-105'
                            : stateVal === 2
                            ? 'bg-red-500 text-white shadow-2xs font-bold scale-105'
                            : 'bg-[#ECEAE3] text-transparent hover:bg-slate-200 border border-[#D3CFC3]'
                        }`}
                      >
                        {stateVal === 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stateVal === 2 ? <CloseIcon className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                      </button>
                    </td>
                  );
                })}

                {/* Participation Cells (Toggle) */}
                {Array.from({ length: config.participationCount }).map((_, i) => {
                  const stateVal: ToggleState = sGrades.participation[i] ?? 0;
                  return (
                    <td key={`part-${i}`} className="py-1.5 px-0.5 text-center">
                      <button
                        type="button"
                        onClick={() => onUpdateToggle(student.id, 'participation', i)}
                        title="کلیک بکە: باش ✓ / لاواز ✗ / پاککردنەوە"
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer mx-auto text-xs ${
                          stateVal === 1
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold scale-105'
                            : stateVal === 2
                            ? 'bg-red-500 text-white shadow-2xs font-bold scale-105'
                            : 'bg-[#ECEAE3] text-transparent hover:bg-slate-200 border border-[#D3CFC3]'
                        }`}
                      >
                        {stateVal === 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stateVal === 2 ? <CloseIcon className="w-3.5 h-3.5 stroke-[3]" /> : '·'}
                      </button>
                    </td>
                  );
                })}

                {/* Total Activity (10) */}
                <td className="py-2 px-2 text-center border-l border-[#E4E0D6]">
                  <span
                    className={`inline-block min-w-[36px] px-1.5 py-0.5 rounded font-black text-xs border ${getScoreColorClass(
                      act.total10,
                      10
                    )}`}
                    title={`ئەرک: ${act.hwScore} | کویز: ${act.quizScore} | ڕەفتار: ${act.behaviorScore} | بەشداری: ${act.participationScore}`}
                  >
                    {formatNum(act.total10)}
                  </span>
                </td>

                {/* Exam Cells (Numeric out of examMax) */}
                {Array.from({ length: config.examCount }).map((_, i) => {
                  const val = sGrades.exams[i];
                  const colKey = `exam-${i}`;
                  const refKey = `${rowIdx}-${colKey}`;
                  return (
                    <td key={colKey} className="py-1.5 px-0.5 text-center">
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(refKey, el);
                          else inputRefs.current.delete(refKey);
                        }}
                        type="text"
                        inputMode="decimal"
                        value={val !== null && val !== undefined ? String(val) : ''}
                        placeholder="—"
                        onChange={(e) => {
                          const parsed = parseKurdishNumber(e.target.value);
                          if (parsed === null) {
                            onUpdateNumber(student.id, 'exams', i, null);
                          } else {
                            const clamped = Math.min(Math.max(parsed, 0), config.examMax);
                            onUpdateNumber(student.id, 'exams', i, clamped);
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colKey)}
                        className={`w-11 h-7 text-center rounded-md font-semibold text-xs border border-[#E4E0D6] focus:border-[#2F6B5E] focus:ring-1 focus:ring-[#2F6B5E] outline-hidden transition ${
                          val !== null
                            ? val >= config.examMax * 0.7
                              ? 'bg-teal-50 text-teal-900 border-teal-300 font-bold'
                              : val >= config.examMax * 0.5
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-red-50 text-red-900 border-red-300'
                            : 'bg-white text-[#23291F]'
                        }`}
                      />
                    </td>
                  );
                })}

                {/* Exam Average (20) */}
                <td className="py-2 px-2 text-center border-l border-[#E4E0D6]">
                  <span
                    className={`inline-block min-w-[36px] px-1.5 py-0.5 rounded font-black text-xs border ${getScoreColorClass(
                      exam.average,
                      config.examMax
                    )}`}
                  >
                    {formatNum(exam.average)}
                  </span>
                </td>

                {/* Monthly Total (30) */}
                <td className="py-2 px-3 text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className={`inline-block min-w-[42px] px-2 py-0.5 rounded-md font-black text-sm ${
                        isPassing
                          ? 'bg-[#2F6B5E] text-white shadow-2xs'
                          : 'bg-red-600 text-white shadow-2xs'
                      }`}
                    >
                      {formatNum(monthlyTotal)}
                    </span>
                    <span className="text-[10px] text-[#6B7263] mt-0.5">
                      {isPassing ? 'دەرچوو' : 'کەوتوو'}
                    </span>
                  </div>
                </td>

                {/* Row Actions */}
                <td className="py-2 px-2 text-center no-print">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEditStudent(student)}
                      className="p-1 rounded text-[#6B7263] hover:text-[#2F6B5E] hover:bg-slate-100 transition"
                      title="دەستکاری ناوی قوتابی"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`دڵنیایت لە سڕینەوەی ${student.name}؟`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-1 rounded text-[#6B7263] hover:text-red-600 hover:bg-red-50 transition"
                      title="سڕینەوەی قوتابی"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
