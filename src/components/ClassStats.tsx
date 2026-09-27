import React from 'react';
import { Award, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { Student, StudentGrades, ColumnConfig } from '../types';
import { calculateActivity10, calculateExamScore, calculateMonthlyTotal30 } from '../utils/numberParser';

interface ClassStatsProps {
  students: Student[];
  grades: Record<string, StudentGrades>;
  config: ColumnConfig;
}

export const ClassStats: React.FC<ClassStatsProps> = ({ students, grades, config }) => {
  if (students.length === 0) return null;

  let totalMonthlyScoreSum = 0;
  let gradedStudentsCount = 0;
  let passCount = 0;
  let highestScore = -1;
  let topStudentName = '';
  let atRiskCount = 0;

  students.forEach((st) => {
    const sGrades = grades[st.id];
    if (!sGrades) return;

    const act = calculateActivity10(sGrades, config);
    const exam = calculateExamScore(sGrades.exams, config.examMax);

    // If at least one grade is entered
    const hasAnyGrade =
      (Array.isArray(sGrades?.hw) && sGrades.hw.some((v) => v !== 0)) ||
      (Array.isArray(sGrades?.quiz) && sGrades.quiz.some((v) => v !== null)) ||
      (Array.isArray(sGrades?.behavior) && sGrades.behavior.some((v) => v !== 0)) ||
      (Array.isArray(sGrades?.participation) && sGrades.participation.some((v) => v !== 0)) ||
      (Array.isArray(sGrades?.exams) && sGrades.exams.some((v) => v !== null));

    if (hasAnyGrade) {
      gradedStudentsCount++;
      const monthlyTotal = calculateMonthlyTotal30(act.total10, exam.average);
      totalMonthlyScoreSum += monthlyTotal;

      if (monthlyTotal > highestScore) {
        highestScore = monthlyTotal;
        topStudentName = st.name;
      }

      // In 30-mark system: 15 is passing (50%)
      if (monthlyTotal >= 15) {
        passCount++;
      } else {
        atRiskCount++;
      }
    }
  });

  const averageScore = gradedStudentsCount > 0 ? (totalMonthlyScoreSum / gradedStudentsCount).toFixed(1) : '—';
  const passRate = gradedStudentsCount > 0 ? Math.round((passCount / gradedStudentsCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      <div className="bg-white border border-[#E4E0D6] rounded-xl p-3.5 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-[#2F6B5E]/10 text-[#2F6B5E] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[#6B7263] font-medium">کۆی گشتی قوتابیان</div>
          <div className="text-lg font-bold text-[#23291F] flex items-baseline gap-1.5">
            <span>{students.length}</span>
            <span className="text-xs font-normal text-[#6B7263]">قوتابی</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E4E0D6] rounded-xl p-3.5 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[#6B7263] font-medium">تێکڕای پۆل (لە ٣٠)</div>
          <div className="text-lg font-bold text-[#23291F]">
            {averageScore}
            <span className="text-xs font-normal text-[#6B7263] mr-1">/ ٣٠</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E4E0D6] rounded-xl p-3.5 shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-[#6B7263] font-medium">بەرزترین نمرە</div>
          <div className="text-lg font-bold text-emerald-700 truncate">
            {highestScore >= 0 ? `${highestScore}` : '—'}
            {topStudentName && (
              <span className="text-xs font-normal text-[#6B7263] mr-1.5 truncate">({topStudentName})</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E4E0D6] rounded-xl p-3.5 shadow-xs flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          passRate >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
        }`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-[#6B7263] font-medium">ڕێژەی دەرچوون</div>
          <div className="text-lg font-bold text-[#23291F]">
            ٪{passRate}
            <span className="text-xs font-normal text-[#6B7263] mr-1.5">
              ({passCount} دەرچوو{atRiskCount > 0 ? ` · ${atRiskCount} پێویست` : ''})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
