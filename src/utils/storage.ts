import { ClassData, ColumnConfig, StudentGrades, AppState } from '../types';

export const DEFAULT_COLUMN_CONFIG: ColumnConfig = {
  hwCount: 5,
  quizCount: 4,
  behaviorCount: 4,
  participationCount: 5,
  examCount: 3,
  hwTarget: 2,
  quizTarget: 4,
  behaviorTarget: 2,
  participationTarget: 2,
  quizMax: 10,
  examMax: 20,
};

export function createEmptyGrades(config: ColumnConfig = DEFAULT_COLUMN_CONFIG): StudentGrades {
  return {
    hw: new Array(config.hwCount).fill(0),
    quiz: new Array(config.quizCount).fill(null),
    behavior: new Array(config.behaviorCount).fill(0),
    participation: new Array(config.participationCount).fill(0),
    exams: new Array(config.examCount).fill(null),
  };
}

export const INITIAL_CLASSES: ClassData[] = [
  {
    id: 'A',
    name: 'پۆلی A',
    students: [
      { id: 'a-1', name: 'شاهی', lastYear: 96 },
      { id: 'a-2', name: 'ئیمەن', lastYear: 90 },
      { id: 'a-3', name: 'ئەلیاز', lastYear: null },
      { id: 'a-4', name: 'سارێژ', lastYear: 87 },
      { id: 'a-5', name: 'ئەمین', lastYear: 78 },
      { id: 'a-6', name: 'پابەند', lastYear: null },
      { id: 'a-7', name: 'ڕەنج', lastYear: '٨٠+' },
      { id: 'a-8', name: 'زەکەریا', lastYear: null },
      { id: 'a-9', name: 'هاروون', lastYear: '٧٠+' },
      { id: 'a-10', name: 'مێهران', lastYear: null },
      { id: 'a-11', name: 'کارا', lastYear: 98 },
      { id: 'a-12', name: 'ژیر', lastYear: null },
      { id: 'a-13', name: 'یاسا', lastYear: null },
      { id: 'a-14', name: 'دلڤان', lastYear: '٥٠+' },
      { id: 'a-15', name: 'محەمەد سیروان', lastYear: 95 },
      { id: 'a-16', name: 'ڕەهەند', lastYear: null },
      { id: 'a-17', name: 'ڕەند', lastYear: '٨٠+' },
      { id: 'a-18', name: 'ڕاسان', lastYear: null },
      { id: 'a-19', name: 'ئادەم', lastYear: 94 },
    ],
    grades: {},
  },
  {
    id: 'B',
    name: 'پۆلی B',
    students: [
      { id: 'b-1', name: 'موهەنەد', lastYear: null },
      { id: 'b-2', name: 'سەیف', lastYear: 94 },
      { id: 'b-3', name: 'یوسف', lastYear: null },
      { id: 'b-4', name: 'یاد', lastYear: null },
      { id: 'b-5', name: 'ڕوان', lastYear: 95 },
      { id: 'b-6', name: 'ڕەهەند', lastYear: null },
      { id: 'b-7', name: 'عەبدولڕەحمان', lastYear: null },
      { id: 'b-8', name: 'مستەفا', lastYear: null },
      { id: 'b-9', name: 'هێمن', lastYear: 90 },
      { id: 'b-10', name: 'ئیمەن', lastYear: 50 },
      { id: 'b-11', name: 'دیدار', lastYear: 82 },
      { id: 'b-12', name: 'چیا', lastYear: 80 },
      { id: 'b-13', name: 'ئەحمەد (١)', lastYear: 100 },
      { id: 'b-14', name: 'ئەحمەد (٢)', lastYear: 87 },
      { id: 'b-15', name: 'شڤان', lastYear: 90 },
      { id: 'b-16', name: 'ئەحمەد (٣)', lastYear: 100 },
      { id: 'b-17', name: 'عەبدولڕەحمان (٢)', lastYear: 70 },
      { id: 'b-18', name: 'مستەفا (٢)', lastYear: 50 },
      { id: 'b-19', name: 'عەبدوڵڵا', lastYear: 96 },
    ],
    grades: {},
  },
  {
    id: 'C',
    name: 'پۆلی C',
    students: [
      { id: 'c-1', name: 'محەمەد', lastYear: 89 },
      { id: 'c-2', name: 'ئاران', lastYear: 100 },
      { id: 'c-3', name: 'مەروان', lastYear: null },
      { id: 'c-4', name: 'مستەفا', lastYear: 100 },
      { id: 'c-5', name: 'موهەیمەن', lastYear: 72 },
      { id: 'c-6', name: 'ڕەها', lastYear: 97 },
      { id: 'c-7', name: 'دیاکۆ', lastYear: 98 },
      { id: 'c-8', name: 'لێهات', lastYear: null },
      { id: 'c-9', name: 'ڕەوەند', lastYear: 82 },
      { id: 'c-10', name: 'باران', lastYear: 98 },
      { id: 'c-11', name: 'ڕەهەند', lastYear: 92 },
      { id: 'c-12', name: 'ئیاد', lastYear: null },
      { id: 'c-13', name: 'میران', lastYear: null },
      { id: 'c-14', name: 'عومەر', lastYear: 85 },
      { id: 'c-15', name: 'هێڤار', lastYear: 80 },
      { id: 'c-16', name: 'عەبدولڕەحمان', lastYear: 70 },
      { id: 'c-17', name: 'مستەفا (٢)', lastYear: 50 },
      { id: 'c-18', name: 'عەبدوڵڵا', lastYear: 96 },
      { id: 'c-19', name: 'یوسف (١)', lastYear: '٩٠+' },
      { id: 'c-20', name: 'ڕاسان', lastYear: null },
      { id: 'c-21', name: 'هەژیر', lastYear: 92 },
      { id: 'c-22', name: 'محەمەد (٢)', lastYear: 83 },
      { id: 'c-23', name: 'یوسف (٢)', lastYear: 77 },
    ],
    grades: {},
  },
  {
    id: 'D',
    name: 'پۆلی D',
    students: [
      { id: 'd-1', name: 'ڕۆژیار', lastYear: 90 },
      { id: 'd-2', name: 'هۆگر', lastYear: '٨٠+' },
      { id: 'd-3', name: 'محەمەد ئەکرەم', lastYear: '٧٠+' },
      { id: 'd-4', name: 'ئومێد', lastYear: 85 },
      { id: 'd-5', name: 'یوسف', lastYear: 90 },
      { id: 'd-6', name: 'ئەرژەنگ', lastYear: 90 },
      { id: 'd-7', name: 'هەژیر', lastYear: null },
      { id: 'd-8', name: 'کاژیار', lastYear: 70 },
      { id: 'd-9', name: 'میر', lastYear: 70 },
      { id: 'd-10', name: 'مانی', lastYear: 80 },
      { id: 'd-11', name: 'محەمەد کەمال', lastYear: null },
      { id: 'd-12', name: 'باهۆز', lastYear: 80 },
      { id: 'd-13', name: 'ئۆرەند', lastYear: 100 },
      { id: 'd-14', name: 'عەبدولڕەحمان', lastYear: null },
      { id: 'd-15', name: 'عەبدوڵڵا', lastYear: 93 },
      { id: 'd-16', name: 'محەمەد عومەر', lastYear: 80 },
      { id: 'd-17', name: 'شاکار', lastYear: null },
      { id: 'd-18', name: 'لیهاد', lastYear: null },
      { id: 'd-19', name: 'سەفا', lastYear: 98 },
      { id: 'd-20', name: 'سوهەیب', lastYear: 80 },
      { id: 'd-21', name: 'دیکان', lastYear: 94 },
    ],
    grades: {},
  },
];

const STORAGE_KEY = 'kurdish_gradebook_v5';

const memoryStore: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    // In Safari iframe with 3P cookies disabled, localStorage throws
  }
  return memoryStore[key] || null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    // Ignore and fallback to in-memory store
  }
  memoryStore[key] = value;
}

function sanitizeStudentGrades(g: any, config: ColumnConfig): StudentGrades {
  return {
    hw: Array.isArray(g?.hw) ? g.hw : new Array(config.hwCount).fill(0),
    quiz: Array.isArray(g?.quiz) ? g.quiz : new Array(config.quizCount).fill(null),
    behavior: Array.isArray(g?.behavior) ? g.behavior : new Array(config.behaviorCount).fill(0),
    participation: Array.isArray(g?.participation) ? g.participation : new Array(config.participationCount).fill(0),
    exams: Array.isArray(g?.exams) ? g.exams : new Array(config.examCount).fill(null),
  };
}

export function loadSavedState(): AppState {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.classes) && parsed.classes.length > 0) {
        const config: ColumnConfig = { ...DEFAULT_COLUMN_CONFIG, ...parsed.config };
        const cleanedClasses: ClassData[] = parsed.classes.map((cls: any) => {
          const grades: Record<string, StudentGrades> = {};
          if (Array.isArray(cls.students)) {
            cls.students.forEach((st: any) => {
              if (st && st.id) {
                grades[st.id] = sanitizeStudentGrades(cls.grades?.[st.id], config);
              }
            });
          }
          return {
            id: cls.id || 'A',
            name: cls.name || 'پۆل',
            students: Array.isArray(cls.students) ? cls.students : [],
            grades,
          };
        });

        return {
          classes: cleanedClasses,
          activeClassId: parsed.activeClassId || cleanedClasses[0].id,
          config,
          subjectName: parsed.subjectName || 'وانەی زانست / ماتماتیک',
          teacherName: parsed.teacherName || 'مامۆستا',
        };
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
  }

  // Pre-seed initial grades
  const initial = INITIAL_CLASSES.map(cls => {
    const grades: Record<string, StudentGrades> = {};
    cls.students.forEach(st => {
      grades[st.id] = createEmptyGrades(DEFAULT_COLUMN_CONFIG);
    });
    return { ...cls, grades };
  });

  return {
    classes: initial,
    activeClassId: 'A',
    config: DEFAULT_COLUMN_CONFIG,
    subjectName: 'تۆماری نمرەی وەرز',
    teacherName: 'مامۆستا',
  };
}

export function saveStateToStorage(state: AppState): void {
  try {
    safeSetItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}
