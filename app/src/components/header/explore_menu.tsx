import { useState } from 'react';
import { useExploreMenuCourses } from './use_explore_menu_courses';

export default function ExploreMenu() {
    const { subjects } = useExploreMenuCourses();
    const [activeSection, setActiveSection] = useState('');
    const activeSubject = subjects.find((subject) => subject.subjectName === activeSection) ?? subjects[0];
    const courses = activeSubject?.courses ?? [];

    return (
        <nav className="nav nav--primary">
            <ul>
                <li
                    className="explore-menu"
                    onMouseEnter={() => setActiveSection((currentValue) => currentValue || subjects[0]?.subjectName || '')}
                >
                    <button
                        type="button"
                        className="explore-menu__toggle"
                        aria-expanded="true"
                        aria-haspopup="true"
                    >
                        Explore
                    </button>

                    <div className="explore-menu__dropdown">
                        <div className="explore-menu__subjects">
                            {subjects.map((subject) => (
                                <button
                                    key={subject.subjectName}
                                    type="button"
                                    className={`explore-menu__subject ${activeSubject?.subjectName === subject.subjectName ? 'is-active' : ''}`}
                                    onMouseEnter={() => setActiveSection(subject.subjectName)}
                                >
                                    {subject.subjectName}
                                </button>
                            ))}
                        </div>

                        <div className="explore-menu__courses">
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <a key={course.slug} href={`/courses/${course.slug}`} className="explore-menu__course">
                                        {course.title}
                                    </a>
                                ))
                            ) : (
                                <span className="explore-menu__course">No courses available</span>
                            )}
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
