export type ISODateString = string;

export type User = {
  id: string;
  localStorageKey: string;
  progresses?: Progress[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Progress = {
  id: string;
  progress: number;
  userId: string;
  courseId: string;
  user?: User;
  course?: Course;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type Subject = {
  id: number;
  name: string;
  description: string;
  topics?: Topic[];
};

export type Topic = {
  id: number;
  name: string;
  description: string;
  subjectId: number;
  subject?: Subject;
  courses?: Course[];
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  stars: number;
  description: string;
  lessonsCount: number;
  hoursCount: number;
  priorKnowledge: string[];
  learnObjectives: string[];
  topicId: number;
  topic?: Topic;
  modules?: CourseModule[];
  progresses?: Progress[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CourseModule = {
  id: number;
  name: string;
  description: string;
  courseId: string;
  course?: Course;
  lessons?: Lesson[];
};

export type Lesson = {
  id: number;
  name: string;
  description: string;
  moduleId: number;
  module?: CourseModule;
  content?: LessonContent | null;
};

export type LessonContent = {
  id: number;
  lessonId: number;
  overview?: string | null;
  videoUrl?: string | null;
  body: string;
  resources: string[];
  exerciseCount: number;
  durationMinutes: number;
  lesson?: Lesson;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

export type CourseSummary = Pick<
  Course,
  | 'id'
  | 'title'
  | 'slug'
  | 'stars'
  | 'description'
  | 'lessonsCount'
  | 'hoursCount'
  | 'priorKnowledge'
  | 'learnObjectives'
>;
