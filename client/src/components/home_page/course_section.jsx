
import { useState } from 'react'

const roadmapGroups = [
    {
        id: 'popular',
        label: 'Most Popular Courses',
        description: 'Trending resources on in-demand topics. Recently published or updated learning paths.',
        items: [
            {
                type: 'Course',
                title: 'Grokking Modern System Design Interview',
                description: 'Master scalable architectures, distributed systems fundamentals and interview-ready design tradeoffs.',
                duration: '26 h',
                level: 'Intermediate',
            },
            {
                type: 'Course',
                title: 'Grokking the Coding Interview Patterns',
                description: 'Build pattern recognition for arrays, graphs, sliding windows and the interview questions behind them.',
                duration: '85 h',
                level: 'Intermediate',
            },
            {
                type: 'Course',
                title: 'Agentic System Design Crash Course',
                description: 'Learn how to structure practical AI agents, orchestrate workflows and apply solid design frameworks.',
                duration: '4 h',
                level: 'Intermediate',
            },
            {
                type: 'Course',
                title: 'Agentic System Design',
                description: 'Explore autonomous agents, evaluation loops and the architectures behind robust AI systems.',
                duration: '6 h',
                level: 'Advanced',
            },
        ],
    },
    {
        id: 'quantum',
        label: 'Quantum Computing',
        description: 'Learning guides that connect the math, physics and software behind quantum technologies.',
        items: [
            {
                type: 'Path',
                title: 'Introduction to Quantum Computing',
                description: 'Start from qubits, gates and circuits before moving into algorithms and real use cases.',
                duration: '12 h',
                level: 'Beginner',
            },
            {
                type: 'Course',
                title: 'Quantum Programming with Qiskit',
                description: 'Build circuits, simulate experiments and understand the development workflow in Python.',
                duration: '18 h',
                level: 'Intermediate',
            },
            {
                type: 'Guide',
                title: 'Quantum Hardware Overview',
                description: 'Compare superconducting, trapped-ion and photonic approaches to modern hardware design.',
                duration: '5 h',
                level: 'Beginner',
            },
            {
                type: 'Course',
                title: 'Quantum Algorithms Explained',
                description: 'Break down Grover, Shor and variational methods with practical intuition instead of jargon.',
                duration: '14 h',
                level: 'Advanced',
            },
        ],
    },
    {
        id: 'math',
        label: 'Mathematics',
        description: 'Structured tracks for the mathematical toolkit behind engineering, AI and quantum computing.',
        items: [
            {
                type: 'Course',
                title: 'Linear Algebra for Computing',
                description: 'Vectors, eigensystems, decompositions and geometric reasoning for modern technical fields.',
                duration: '20 h',
                level: 'Intermediate',
            },
            {
                type: 'Course',
                title: 'Calculus II',
                description: 'Series, multivariable foundations and the analytical methods used across physics and engineering.',
                duration: '24 h',
                level: 'Intermediate',
            },
            {
                type: 'Guide',
                title: 'Probability for Engineers',
                description: 'From random variables to estimation, with clear applications in systems and data work.',
                duration: '10 h',
                level: 'Beginner',
            },
            {
                type: 'Path',
                title: 'Discrete Math Essentials',
                description: 'Logic, combinatorics and graph thinking for algorithms, proofs and computer science foundations.',
                duration: '16 h',
                level: 'Beginner',
            },
        ],
    },
    {
        id: 'cs',
        label: 'Computer Science',
        description: 'Core study paths for algorithms, systems and the foundations of software problem solving.',
        items: [
            {
                type: 'Course',
                title: 'Data Structures',
                description: 'Study lists, trees, heaps, hash tables and the tradeoffs behind choosing each structure.',
                duration: '22 h',
                level: 'Beginner',
            },
            {
                type: 'Course',
                title: 'Algorithms',
                description: 'Greedy methods, dynamic programming, graph traversal and the reasoning behind efficient solutions.',
                duration: '28 h',
                level: 'Intermediate',
            },
            {
                type: 'Course',
                title: 'Computer Graphics',
                description: 'Build intuition for rendering pipelines, transformations and the math of visual computing.',
                duration: '19 h',
                level: 'Intermediate',
            },
            {
                type: 'Path',
                title: 'Python for Problem Solving',
                description: 'Use Python as a practical tool for algorithms, automation and scientific workflows.',
                duration: '9 h',
                level: 'Beginner',
            },
        ],
    },
]

export default function CourseSection() {
    const [activeTab, setActiveTab] = useState(roadmapGroups[0].id)
    const activeGroup = roadmapGroups.find((group) => group.id === activeTab) ?? roadmapGroups[0]

    return (
        <section className="course-showcase">
            <div className="course-showcase__header">
                <p className="course-showcase__eyebrow">Roadmaps</p>
                <h2>Most Popular Courses</h2>
            </div>

            <div className="course-showcase__tabs" role="tablist" aria-label="Course roadmaps">
                {roadmapGroups.map((group) => (
                    <button
                        key={group.id}
                        type="button"
                        role="tab"
                        aria-selected={activeGroup.id === group.id}
                        className={`course-showcase__tab${activeGroup.id === group.id ? ' is-active' : ''}`}
                        onClick={() => setActiveTab(group.id)}
                    >
                        {group.label}
                    </button>
                ))}
            </div>

            <p className="course-showcase__description">{activeGroup.description}</p>

            <div className="course-showcase__grid">
                {activeGroup.items.map((item) => (
                    <article key={item.title} className="course-card">
                        <div className="course-card__top">
                            <span className="course-card__badge">{item.type}</span>
                            <button type="button" className="course-card__save" aria-label={`Save ${item.title}`}>
                                &#9734;
                            </button>
                        </div>

                        <div className="course-card__body">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>

                        <div className="course-card__meta">
                            <span>{item.duration}</span>
                            <span>{item.level}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
