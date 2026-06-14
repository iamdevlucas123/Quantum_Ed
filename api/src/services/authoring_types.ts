export type CourseInput = {
  title?: string;
  slug?: string;
  description?: string;
  stars?: number;
  priorKnowledge?: string[];
  learnObjectives?: string[];
  topicId?: number;
};

export type ModuleInput = {
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
};

export type LessonInput = {
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
};

export type LessonContentInput = {
  overview?: string | null;
  videoUrl?: string | null;
  body?: string;
  resources?: string[];
  exerciseCount?: number;
  durationMinutes?: number;
};

export type ReorderItem = {
  id?: number;
  order?: number;
};
