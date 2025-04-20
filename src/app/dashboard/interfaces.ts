// Rozhraní pro dashboard komponenty

// Struktura cíle z backendu
export interface Goal {
  id: number;
  goal_name: string;
  reason: string;
  destination: string;
  new_self: string;
  daily_action: string;
  daily_learning: string;
  daily_visualization: string;
  duration: number;
}

// Struktura úkolu pro vnitřní logiku checkboxů
export interface Task {
  id: number;
  name: string;
  completed: boolean;
}

// Struktura progressu z tabulky "Progress"
export interface Progress {
  id: number;
  userId: number;
  goalId: number;
  completedDays: number;
  lastCompletionDate: string | null;
  streak: number;
}

// Rozhraní pro kurzy
export interface Course {
  id: number;
  name: string;
  description: string;
  image?: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  duration: number;
}

export interface UserCourse {
  id: number;
  progress: number;
  completedAt: string | null;
  course: Course;
} 