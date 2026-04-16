import { useState } from 'react';
import { menuItems } from './menuItems';

export default function ExploreMenu() {
    const subjects = Object.keys(menuItems);
    const [activeSection, setActiveSection] = useState(subjects[0]);

    return (
        <nav className="nav nav--primary">
            <ul>
                <li
                    className="explore-menu"
                    onMouseEnter={() => setActiveSection((currentValue) => currentValue || subjects[0])}
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
                                    key={subject}
                                    type="button"
                                    className={`explore-menu__subject ${activeSection === subject ? 'is-active' : ''}`}
                                    onMouseEnter={() => setActiveSection(subject)}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>

                        <div className="explore-menu__courses">
                            {Object.keys(menuItems[activeSection]).map((course) => (
                                <a key={course} href="#" className="explore-menu__course">
                                    {course}
                                </a>
                            ))}
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
