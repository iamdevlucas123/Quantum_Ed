import { describe, expect, it, vi } from 'vitest';

import { AuthoringError } from '../authoring_errors';
import {
  mapLessonContentInput,
  mapLessonInput,
  mapModuleInput,
  normalizeReorderItems,
} from '../authoring_rules';

vi.mock('../../config/prisma', () => ({
  prisma: {},
}));

describe('authoring rules', () => {
  it('rejects empty reorder lists', () => {
    expect(() => normalizeReorderItems([])).toThrow(new AuthoringError(400, 'items must be a non-empty array'));
  });

  it('rejects duplicate reorder ids', () => {
    expect(() => normalizeReorderItems([
      { id: 1, order: 1 },
      { id: 1, order: 2 },
    ])).toThrow(new AuthoringError(400, 'items must not contain duplicate ids'));
  });

  it('rejects invalid reorder values', () => {
    expect(() => normalizeReorderItems([{ id: 0, order: 1 }])).toThrow(AuthoringError);
    expect(() => normalizeReorderItems([{ id: 1, order: 0 }])).toThrow(AuthoringError);
  });

  it('normalizes reorder items by requested order', () => {
    expect(normalizeReorderItems([
      { id: 10, order: 3 },
      { id: 20, order: 1 },
      { id: 30, order: 2 },
    ])).toEqual([
      { id: 20, order: 1 },
      { id: 30, order: 2 },
      { id: 10, order: 3 },
    ]);
  });

  it('maps required module input for create', () => {
    expect(mapModuleInput({
      name: 'Module 1',
      slug: 'module-1',
      description: 'Intro',
      order: 1,
    }, true)).toEqual({
      name: 'Module 1',
      slug: 'module-1',
      description: 'Intro',
      order: 1,
    });
  });

  it('accepts partial module input for update', () => {
    expect(mapModuleInput({ name: 'Updated' }, false)).toEqual({
      name: 'Updated',
      slug: undefined,
      description: undefined,
      order: undefined,
    });
  });

  it('rejects module slugs outside kebab-case', () => {
    expect(() => mapModuleInput({
      name: 'Module 1',
      slug: 'Module One',
      description: 'Intro',
      order: 1,
    }, true)).toThrow(new AuthoringError(400, 'slug must use kebab-case'));
  });

  it('maps lesson input with the same required rules as modules', () => {
    expect(mapLessonInput({
      name: 'Lesson 1',
      slug: 'lesson-1',
      description: 'Basics',
      order: 1,
    }, true)).toEqual({
      name: 'Lesson 1',
      slug: 'lesson-1',
      description: 'Basics',
      order: 1,
    });
  });

  it('maps required lesson content input for create', () => {
    expect(mapLessonContentInput({
      body: 'Lesson body',
      resources: ['https://example.com'],
      exerciseCount: 2,
      durationMinutes: 45,
    }, true)).toEqual({
      overview: undefined,
      videoUrl: undefined,
      body: 'Lesson body',
      resources: ['https://example.com'],
      exerciseCount: 2,
      durationMinutes: 45,
    });
  });

  it('rejects negative lesson content numbers', () => {
    expect(() => mapLessonContentInput({
      body: 'Lesson body',
      resources: [],
      exerciseCount: -1,
      durationMinutes: 45,
    }, true)).toThrow(new AuthoringError(400, 'exerciseCount must be a number greater than or equal to 0'));
  });

  it('rejects lesson content resources that are not strings', () => {
    expect(() => mapLessonContentInput({
      body: 'Lesson body',
      resources: ['valid', 10] as unknown as string[],
      exerciseCount: 1,
      durationMinutes: 45,
    }, true)).toThrow(new AuthoringError(400, 'resources must be an array of strings'));
  });
});
