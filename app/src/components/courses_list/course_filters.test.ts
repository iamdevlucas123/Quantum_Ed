import { describe, expect, it } from 'vitest';

import type { CourseListItem } from '../../services/course_api';
import { ALL_TRACKS, filterCourses, getCourseSubjects } from './course_filters';

const createCourse = (overrides: Partial<CourseListItem>): CourseListItem => ({
  id: overrides.id ?? 'course-1',
  title: overrides.title ?? 'Prompt Engineering',
  slug: overrides.slug ?? 'prompt-engineering',
  stars: overrides.stars ?? 5,
  description: overrides.description ?? 'Build reliable prompts',
  lessonsCount: overrides.lessonsCount ?? 6,
  hoursCount: overrides.hoursCount ?? 4,
  saved: overrides.saved,
  topic: overrides.topic ?? {
    name: 'Prompting',
    subject: {
      name: 'AI Engineering',
    },
  },
});

const courses = [
  createCourse({
    id: 'course-1',
    title: 'Prompt Engineering',
    description: 'Build reliable prompts',
    topic: { name: 'Prompting', subject: { name: 'AI Engineering' } },
  }),
  createCourse({
    id: 'course-2',
    title: 'Linear Algebra',
    description: 'Vectors and matrices',
    topic: { name: 'Math Foundations', subject: { name: 'Mathematics' } },
  }),
  createCourse({
    id: 'course-3',
    title: 'Production RAG',
    description: 'Retrieval systems for LLM applications',
    topic: { name: 'RAG Systems', subject: { name: 'AI Engineering' } },
  }),
];

describe('course filters', () => {
  it('builds subjects with all tracks first', () => {
    expect(getCourseSubjects(courses)).toEqual([ALL_TRACKS, 'AI Engineering', 'Mathematics']);
  });

  it('returns all courses with all tracks and empty search', () => {
    expect(filterCourses(courses, ALL_TRACKS, '')).toHaveLength(3);
  });

  it('filters by subject', () => {
    expect(filterCourses(courses, 'Mathematics', '').map((course) => course.id)).toEqual(['course-2']);
  });

  it('filters by title, description, topic, and subject case-insensitively', () => {
    expect(filterCourses(courses, ALL_TRACKS, 'linear').map((course) => course.id)).toEqual(['course-2']);
    expect(filterCourses(courses, ALL_TRACKS, 'vectors').map((course) => course.id)).toEqual(['course-2']);
    expect(filterCourses(courses, ALL_TRACKS, 'rag systems').map((course) => course.id)).toEqual(['course-3']);
    expect(filterCourses(courses, ALL_TRACKS, 'ai engineering').map((course) => course.id)).toEqual(['course-1', 'course-3']);
  });

  it('trims search text and returns empty results when nothing matches', () => {
    expect(filterCourses(courses, ALL_TRACKS, '  PROMPT  ').map((course) => course.id)).toEqual(['course-1']);
    expect(filterCourses(courses, 'Mathematics', 'prompt')).toEqual([]);
  });
});
