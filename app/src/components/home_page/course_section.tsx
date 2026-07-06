'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getHomeCourseCatalog, type HomeCourseSubjectGroup } from '../../services/course_catalog';

export default function CourseSection() {
    const [subjectGroups, setSubjectGroups] = useState<HomeCourseSubjectGroup[]>([]);
    const [activeSubject, setActiveSubject] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        getHomeCourseCatalog()
            .then((groups) => {
                if (!isMounted) {
                    return;
                }

                setSubjectGroups(groups);
                setActiveSubject((currentSubject) => currentSubject || groups[0]?.subjectName || '');
            })
            .catch((currentError) => {
                if (!isMounted) {
                    return;
                }

                const message = currentError instanceof Error ? currentError.message : 'Could not load course tracks';
                setError(message);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const activeGroup = useMemo(() => {
        if (subjectGroups.length === 0) {
            return null;
        }

        return subjectGroups.find((group) => group.subjectName === activeSubject) ?? subjectGroups[0];
    }, [activeSubject, subjectGroups]);

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">Roadmaps</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-normal">Mission tracks for high-signal learners</h2>
            </div>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Course roadmaps">
                {subjectGroups.map((group) => (
                    <Button
                        key={group.subjectName}
                        type="button"
                        variant={group.subjectName === activeGroup?.subjectName ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveSubject(group.subjectName)}
                    >
                        {group.subjectName}
                    </Button>
                ))}
            </div>

            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Each track bundles theory, labs and milestone reviews so progress feels like operating a real command deck.
            </p>

            {isLoading ? (
                <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">Loading course tracks...</p>
            ) : null}

            {!isLoading && error ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</p>
            ) : null}

            {!isLoading && !error && activeGroup && activeGroup.courses.length === 0 ? (
                <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No courses available for this track yet.</p>
            ) : null}

            {!isLoading && !error && !activeGroup ? (
                <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No course tracks available yet.</p>
            ) : null}

            {!isLoading && !error && activeGroup ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {activeGroup.courses.map((course) => (
                        <Card className="h-full rounded-lg" key={course.slug}>
                            <CardHeader>
                                <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">{course.badge}</span>

                                <CardTitle className="text-xl leading-tight">{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid flex-1 gap-4">
                                <p className="text-sm leading-6 text-muted-foreground">{course.description}</p>

                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span>{course.lessonsLabel}</span>
                                <span>{course.durationLabel}</span>
                            </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild>
                                    <Link href={`/courses/${course.slug}`}>View course</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
