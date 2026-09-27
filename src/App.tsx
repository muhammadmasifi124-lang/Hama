/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  loadSavedState,
  saveStateToStorage,
  createEmptyGrades,
  DEFAULT_COLUMN_CONFIG,
} from './utils/storage';
import { AppState, ClassData, ColumnConfig, Student, StudentGrades } from './types';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { GradeTable } from './components/GradeTable';
import { ClassStats } from './components/ClassStats';
import { StudentModal } from './components/StudentModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { calculateActivity10, calculateExamScore, calculateMonthlyTotal30 } from './utils/numberParser';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadSavedState());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'risk' | 'unmarked'>('all');

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Auto-save on changes
  useEffect(() => {
    saveStateToStorage(appState);
    setLastSaved(new Date());
  }, [appState]);

  const activeClass = useMemo(() => {
    const found = appState.classes.find((c) => c.id === appState.activeClassId);
    return found || appState.classes[0];
  }, [appState.classes, appState.activeClassId]);

  // Make sure all students have a grade record
  const currentGrades = useMemo(() => {
    if (!activeClass) return {};
    const grades: Record<string, StudentGrades> = {};
    const existingGrades = activeClass.grades || {};

    (activeClass.students || []).forEach((st) => {
      const g = existingGrades[st.id];
      if (!g) {
        grades[st.id] = createEmptyGrades(appState.config);
      } else {
        grades[st.id] = {
          hw: Array.isArray(g.hw) ? g.hw : new Array(appState.config.hwCount).fill(0),
          quiz: Array.isArray(g.quiz) ? g.quiz : new Array(appState.config.quizCount).fill(null),
          behavior: Array.isArray(g.behavior) ? g.behavior : new Array(appState.config.behaviorCount).fill(0),
          participation: Array.isArray(g.participation) ? g.participation : new Array(appState.config.participationCount).fill(0),
          exams: Array.isArray(g.exams) ? g.exams : new Array(appState.config.examCount).fill(null),
        };
      }
    });
    return grades;
  }, [activeClass, appState.config]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    if (!activeClass) return [];
    return (activeClass.students || []).filter((st) => {
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        if (!st.name.toLowerCase().includes(query)) return false;
      }

      // Status filter
      if (filterStatus === 'all') return true;

      const sGrades = currentGrades[st.id];
      if (!sGrades) return filterStatus === 'unmarked';

      const act = calculateActivity10(sGrades, appState.config);
      const exam = calculateExamScore(sGrades.exams, appState.config.examMax);
      const monthlyTotal = calculateMonthlyTotal30(act.total10, exam.average);

      const hasAnyGrade =
        (Array.isArray(sGrades.hw) && sGrades.hw.some((v) => v !== 0)) ||
        (Array.isArray(sGrades.quiz) && sGrades.quiz.some((v) => v !== null)) ||
        (Array.isArray(sGrades.behavior) && sGrades.behavior.some((v) => v !== 0)) ||
        (Array.isArray(sGrades.participation) && sGrades.participation.some((v) => v !== 0)) ||
        (Array.isArray(sGrades.exams) && sGrades.exams.some((v) => v !== null));

      if (filterStatus === 'unmarked') {
        return !hasAnyGrade;
      }
      if (filterStatus === 'pass') {
        return hasAnyGrade && monthlyTotal >= 15;
      }
      if (filterStatus === 'risk') {
        return hasAnyGrade && monthlyTotal < 15;
      }

      return true;
    });
  }, [activeClass, searchQuery, filterStatus, currentGrades, appState.config]);

  // Handlers for grade updates
  const handleUpdateToggle = useCallback(
    (studentId: string, type: 'hw' | 'behavior' | 'participation', index: number) => {
      setAppState((prev) => {
        const nextClasses = prev.classes.map((cls) => {
          if (cls.id !== prev.activeClassId) return cls;
          const currentStudentGrades = cls.grades[studentId] || createEmptyGrades(prev.config);
          const currentArr = [...(currentStudentGrades[type] || [])];

          // ensure array length
          while (currentArr.length <= index) currentArr.push(0);

          // Cycle: 0 (empty) -> 1 (good) -> 2 (bad) -> 0 (empty)
          const currentVal = currentArr[index] ?? 0;
          const nextVal = ((currentVal + 1) % 3) as 0 | 1 | 2;
          currentArr[index] = nextVal;

          return {
            ...cls,
            grades: {
              ...cls.grades,
              [studentId]: {
                ...currentStudentGrades,
                [type]: currentArr,
              },
            },
          };
        });

        return { ...prev, classes: nextClasses };
      });
    },
    []
  );

  const handleUpdateNumber = useCallback(
    (studentId: string, type: 'quiz' | 'exams', index: number, value: number | null) => {
      setAppState((prev) => {
        const nextClasses = prev.classes.map((cls) => {
          if (cls.id !== prev.activeClassId) return cls;
          const currentStudentGrades = cls.grades[studentId] || createEmptyGrades(prev.config);
          const currentArr = [...(currentStudentGrades[type] || [])];

          while (currentArr.length <= index) currentArr.push(null);
          currentArr[index] = value;

          return {
            ...cls,
            grades: {
              ...cls.grades,
              [studentId]: {
                ...currentStudentGrades,
                [type]: currentArr,
              },
            },
          };
        });

        return { ...prev, classes: nextClasses };
      });
    },
    []
  );

  // Column counter adjustments (+/-)
  const handleUpdateCount = useCallback(
    (type: 'hw' | 'quiz' | 'behavior' | 'participation' | 'exam', delta: number) => {
      setAppState((prev) => {
        const configKey =
          type === 'hw'
            ? 'hwCount'
            : type === 'quiz'
            ? 'quizCount'
            : type === 'behavior'
            ? 'behaviorCount'
            : type === 'participation'
            ? 'participationCount'
            : 'examCount';

        const currentVal = prev.config[configKey];
        const nextVal = Math.min(12, Math.max(1, currentVal + delta));

        return {
          ...prev,
          config: {
            ...prev.config,
            [configKey]: nextVal,
          },
        };
      });
    },
    []
  );

  // Add / Edit student
  const handleSaveStudent = useCallback(
    (name: string, lastYear: string | number | null) => {
      setAppState((prev) => {
        const nextClasses = prev.classes.map((cls) => {
          if (cls.id !== prev.activeClassId) return cls;

          if (editingStudent) {
            // Update existing student
            const nextStudents = cls.students.map((st) =>
              st.id === editingStudent.id ? { ...st, name, lastYear } : st
            );
            return { ...cls, students: nextStudents };
          } else {
            // Add new student
            const newId = `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
            const newStudent: Student = { id: newId, name, lastYear };
            return {
              ...cls,
              students: [...cls.students, newStudent],
              grades: {
                ...cls.grades,
                [newId]: createEmptyGrades(prev.config),
              },
            };
          }
        });

        return { ...prev, classes: nextClasses };
      });
      setEditingStudent(null);
    },
    [editingStudent]
  );

  const handleDeleteStudent = useCallback((studentId: string) => {
    setAppState((prev) => {
      const nextClasses = prev.classes.map((cls) => {
        if (cls.id !== prev.activeClassId) return cls;
        const nextStudents = cls.students.filter((st) => st.id !== studentId);
        const nextGrades = { ...cls.grades };
        delete nextGrades[studentId];
        return { ...cls, students: nextStudents, grades: nextGrades };
      });
      return { ...prev, classes: nextClasses };
    });
  }, []);

  // Add new class
  const handleAddClass = useCallback((name: string) => {
    const newId = `class-${Date.now()}`;
    const newClass: ClassData = {
      id: newId,
      name,
      students: [],
      grades: {},
    };
    setAppState((prev) => ({
      ...prev,
      classes: [...prev.classes, newClass],
      activeClassId: newId,
    }));
  }, []);

  // Reset class grades
  const handleResetClassGrades = useCallback(() => {
    if (!activeClass) return;
    if (
      window.confirm(
        `دڵنیایت لە سڕینەوەی سەرجەم نمرە تۆمارکراوەکانی ${activeClass.name}؟ (قوتابیەکان ناسڕێنەوە، تەنها نمرەکان پاک دەکرێنەوە)`
      )
    ) {
      setAppState((prev) => {
        const nextClasses = prev.classes.map((cls) => {
          if (cls.id !== prev.activeClassId) return cls;
          const freshGrades: Record<string, StudentGrades> = {};
          cls.students.forEach((st) => {
            freshGrades[st.id] = createEmptyGrades(prev.config);
          });
          return { ...cls, grades: freshGrades };
        });
        return { ...prev, classes: nextClasses };
      });
    }
  }, [activeClass]);

  // Quick fill homework completed for all
  const handleFillAllHW = useCallback(() => {
    if (!activeClass) return;
    setAppState((prev) => {
      const nextClasses = prev.classes.map((cls) => {
        if (cls.id !== prev.activeClassId) return cls;
        const updatedGrades = { ...cls.grades };
        cls.students.forEach((st) => {
          const stG = updatedGrades[st.id] || createEmptyGrades(prev.config);
          const nextHw = [...(Array.isArray(stG.hw) ? stG.hw : [])];
          // Find first 0 or toggle all to 1
          for (let i = 0; i < prev.config.hwCount; i++) {
            if (nextHw[i] === 0 || nextHw[i] === undefined) {
              nextHw[i] = 1;
              break;
            }
          }
          updatedGrades[st.id] = { ...stG, hw: nextHw };
        });
        return { ...cls, grades: updatedGrades };
      });
      return { ...prev, classes: nextClasses };
    });
  }, [activeClass]);

  // CSV Export with UTF-8 BOM so Excel opens Kurdish script correctly
  const handleExportCSV = useCallback(() => {
    if (!activeClass) return;

    let csvContent = '\uFEFF'; // UTF-8 BOM
    // Header row
    const headers = [
      'ڕیزبەندی',
      'ناوی قوتابی',
      'نمرەی ساڵی پار',
      'کۆی چالاکی (١٠)',
      'تێکڕای تاقیکردنەوە (٢٠)',
      'کۆی مانگانە (٣٠)',
      'ئەنجام',
    ];
    csvContent += headers.join(',') + '\r\n';

    activeClass.students.forEach((st, idx) => {
      const sGrades = currentGrades[st.id];
      const act = sGrades ? calculateActivity10(sGrades, appState.config) : { total10: 0 };
      const exam = sGrades ? calculateExamScore(sGrades.exams, appState.config.examMax) : { average: 0 };
      const monthlyTotal = calculateMonthlyTotal30(act.total10, exam.average);
      const status = monthlyTotal >= 15 ? 'دەرچوو' : 'کەوتوو';

      const row = [
        idx + 1,
        `"${st.name.replace(/"/g, '""')}"`,
        st.lastYear !== null ? `"${st.lastYear}"` : '""',
        act.total10,
        exam.average,
        monthlyTotal,
        `"${status}"`,
      ];
      csvContent += row.join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeClass.name}_نمرەی_قوتابیان.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [activeClass, currentGrades, appState.config]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#23291F] px-3 sm:px-6 py-5 max-w-[1400px] mx-auto">
      {/* Header with Class tabs & main actions */}
      <Header
        classes={appState.classes}
        activeClassId={appState.activeClassId}
        onSelectClass={(id) => setAppState((prev) => ({ ...prev, activeClassId: id }))}
        onAddClass={handleAddClass}
        onAddStudent={() => {
          setEditingStudent(null);
          setIsStudentModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onExportCSV={handleExportCSV}
        onPrint={handlePrint}
        subjectName={appState.subjectName}
        onUpdateSubjectName={(name) => setAppState((prev) => ({ ...prev, subjectName: name }))}
        teacherName={appState.teacherName}
        onUpdateTeacherName={(name) => setAppState((prev) => ({ ...prev, teacherName: name }))}
        lastSavedTime={lastSaved}
      />

      {/* Class Statistics Overview Cards */}
      <ClassStats
        students={activeClass ? activeClass.students : []}
        grades={currentGrades}
        config={appState.config}
      />

      {/* Toolbar with Search, Filters, and Column Adjusters */}
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        config={appState.config}
        onUpdateCount={handleUpdateCount}
        onResetClassGrades={handleResetClassGrades}
        onFillAllHW={handleFillAllHW}
      />

      {/* Main Grade Register Table */}
      <GradeTable
        students={filteredStudents}
        grades={currentGrades}
        config={appState.config}
        onUpdateToggle={handleUpdateToggle}
        onUpdateNumber={handleUpdateNumber}
        onEditStudent={(st) => {
          setEditingStudent(st);
          setIsStudentModalOpen(true);
        }}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Footer Info & Explanation */}
      <footer className="mt-8 text-center text-xs text-[#6B7263] border-t border-[#E4E0D6] pt-4 no-print space-y-1">
        <p>
          سیستەمی تۆماری نمرەی قوتابیان — هەژمارکردنی خۆکاری کۆی چالاکی (١٠) و تێکڕای تاقیکردنەوە (٢٠) و کۆی مانگانە (٣٠)
        </p>
        <p className="text-[11px] text-[#6B7263]/80">
          تێبینی: سەرجەم داتاکان بە خۆکارانە لەسەر وێبگەڕەکەت پاشەکەوت دەبن و بە داخستنی پەڕەکە لەدەست ناچن.
        </p>
      </footer>

      {/* Student Add/Edit Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        onDelete={editingStudent ? () => handleDeleteStudent(editingStudent.id) : undefined}
        editingStudent={editingStudent}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={appState.config}
        onSaveConfig={(newConfig) => setAppState((prev) => ({ ...prev, config: newConfig }))}
      />

      {/* iPad / Home Screen Install Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
