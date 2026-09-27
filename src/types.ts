export type ToggleState = 0 | 1 | 2; // 0 = empty/unmarked, 1 = good (✓), 2 = bad (✗)

export interface Student {
  id: string;
  name: string;
  lastYear: number | string | null;
}

export interface StudentGrades {
  hw: ToggleState[];
  quiz: (number | null)[];
  behavior: ToggleState[];
  participation: ToggleState[];
  exams: (number | null)[];
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
  grades: Record<string, StudentGrades>; // keyed by student.id
}

export interface ColumnConfig {
  hwCount: number;
  quizCount: number;
  behaviorCount: number;
  participationCount: number;
  examCount: number;
  hwTarget: number;
  quizTarget: number;
  behaviorTarget: number;
  participationTarget: number;
  quizMax: number;
  examMax: number;
}

export interface AppState {
  classes: ClassData[];
  activeClassId: string;
  config: ColumnConfig;
  subjectName: string;
  teacherName: string;
}

