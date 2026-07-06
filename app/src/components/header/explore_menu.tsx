import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useExploreMenuCourses } from './use_explore_menu_courses';

export default function ExploreMenu() {
    const { subjects } = useExploreMenuCourses();
    const [activeSection, setActiveSection] = useState('');
    const activeSubject = subjects.find((subject) => subject.subjectName === activeSection) ?? subjects[0];
    const courses = activeSubject?.courses ?? [];

    return (
        <nav className="relative hidden sm:block" aria-label="Explore catalog">
            <div
                className="group"
                onMouseEnter={() => setActiveSection((currentValue) => currentValue || subjects[0]?.subjectName || '')}
            >
                <Button type="button" variant="ghost" size="sm" aria-expanded="true" aria-haspopup="true">
                    Explore
                </Button>

                <div className="invisible absolute left-0 top-full z-50 grid w-[min(42rem,calc(100vw-2rem))] grid-cols-[13rem_1fr] overflow-hidden rounded-md border bg-popover text-popover-foreground opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    <div className="border-r bg-muted/40 p-2">
                            {subjects.map((subject) => (
                                <button
                                    key={subject.subjectName}
                                    type="button"
                                    className={cn(
                                        'block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-accent hover:text-accent-foreground',
                                        activeSubject?.subjectName === subject.subjectName && 'bg-accent text-accent-foreground'
                                    )}
                                    onMouseEnter={() => setActiveSection(subject.subjectName)}
                                >
                                    {subject.subjectName}
                                </button>
                            ))}
                        </div>

                    <div className="grid gap-1 p-3">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <Link key={course.slug} href={`/courses/${course.slug}`} className="rounded-md px-3 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground">
                                        {course.title}
                                    </Link>
                                ))
                            ) : (
                                <span className="px-3 py-2 text-sm text-muted-foreground">No courses available</span>
                            )}
                        </div>
                    </div>
            </div>
        </nav>
    );
}
