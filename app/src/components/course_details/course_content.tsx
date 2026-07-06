'use client'

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CourseModuleSummary } from '../../services/course_api';

type CourseContentProps = {
  courseSlug: string;
  lessonsCount: number;
  modules: CourseModuleSummary[];
};

const isModuleCompleted = (module: CourseModuleSummary): boolean => {
  return module.lessons.length > 0 && module.lessons.every((lesson) => {
    return lesson.lessonProgresses?.[0]?.completed === true;
  });
};

export default function CourseContent({ courseSlug, lessonsCount, modules }: CourseContentProps) {
  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<number>>(() => {
    const firstModule = modules[0];
    return firstModule ? new Set([firstModule.id]) : new Set();
  });

  const toggleModule = (moduleId: number): void => {
    setExpandedModuleIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(moduleId)) {
        nextIds.delete(moduleId);
      } else {
        nextIds.add(moduleId);
      }

      return nextIds;
    });
  };

  return (
    <section className="grid gap-5" id="course-roadmap">
      <header>
        <h2 className="text-2xl font-semibold tracking-normal">Learning Roadmap</h2>
        <span className="mt-1 block text-sm text-muted-foreground">{lessonsCount} lessons across hands-on AI engineering modules</span>
      </header>

      <div className="grid gap-4">
        {modules.map((module, index) => {
          const isExpanded = expandedModuleIds.has(module.id);
          const isCompleted = isModuleCompleted(module);
          const lessonsId = `course-module-lessons-${module.id}`;

          return (
            <Card className={isCompleted ? 'border-emerald-800/30 bg-emerald-950/5' : undefined} key={module.id}>
              <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                    <h3 className="text-xl font-semibold leading-tight tracking-normal">{module.name}</h3>
                    {isCompleted ? <strong className="rounded-md bg-emerald-900 px-2 py-1 text-xs font-medium text-white">Completed</strong> : null}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-controls={lessonsId}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Hide' : 'Show'} lessons from ${module.name}`}
                  onClick={() => toggleModule(module.id)}
                >
                  <span>{isExpanded ? 'Hide lessons' : `${module.lessons.length} lessons`}</span>
                </Button>
              </CardHeader>

              {isExpanded ? (
                <CardContent className="grid gap-2" id={lessonsId}>
                  {module.lessons.map((lesson) => (
                    <Link
                      className="grid gap-1 rounded-md border bg-background p-3 transition hover:bg-accent hover:text-accent-foreground"
                      key={lesson.id}
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                    >
                      <strong className="text-sm">{lesson.name}</strong>
                      <span className="text-sm text-muted-foreground">{lesson.description}</span>
                    </Link>
                  ))}
                </CardContent>
              ) : null}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
