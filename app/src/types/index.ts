export type NavigationMenu = Record<string, Record<string, readonly string[]>>;

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string;
  completed?: boolean;
}
