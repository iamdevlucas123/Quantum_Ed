import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../styles/home_page_css/course_section.css';
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
        <section className="course-showcase">
            <div className="course-showcase__header">
                <p className="course-showcase__eyebrow">Roadmaps</p>
                <h2>Mission tracks for high-signal learners</h2>
            </div>

            <div className="course-showcase__tabs" role="tablist" aria-label="Course roadmaps">
                {subjectGroups.map((group) => (
                    <button
                        key={group.subjectName}
                        type="button"
                        className={`course-showcase__tab ${group.subjectName === activeGroup?.subjectName ? 'is-active' : ''}`}
                        onClick={() => setActiveSubject(group.subjectName)}
                    >
                        {group.subjectName}
                    </button>
                ))}
            </div>

            <p className="course-showcase__description">
                Each track bundles theory, labs and milestone reviews so progress feels like operating a real command deck.
            </p>

            {isLoading ? (
                <p className="course-showcase__state">Loading course tracks...</p>
            ) : null}

            {!isLoading && error ? (
                <p className="course-showcase__state course-showcase__state--error">{error}</p>
            ) : null}

            {!isLoading && !error && activeGroup && activeGroup.courses.length === 0 ? (
                <p className="course-showcase__state">No courses available for this track yet.</p>
            ) : null}

            {!isLoading && !error && !activeGroup ? (
                <p className="course-showcase__state">No course tracks available yet.</p>
            ) : null}

            {!isLoading && !error && activeGroup ? (
                <div className="course-showcase__grid">
                    {activeGroup.courses.map((course) => (
                        <Link className="course-card" key={course.slug} to={`/courses/${course.slug}`}>
                            <div className="course-card__top">
                                <span className="course-card__badge">{course.badge}</span>
                            </div>

                            <div className="course-card__body">
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                            </div>

                            <div className="course-card__meta">
                                <span>{course.lessonsLabel}</span>
                                <span>{course.durationLabel}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
