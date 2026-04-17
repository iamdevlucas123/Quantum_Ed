export default function MainContent() {
    return (
        <main className="main-content">
            <section className="lesson-overview">
                <div className="lesson-overview__intro">
                    <p className="lesson-overview__eyebrow">Lesson Overview</p>
                    <h3>What you are learning now</h3>
                    <p>
                        This lesson connects abstract vector operations to geometric interpretation.
                        You will see how scaling, rotation and projection can all be written as linear
                        maps and studied with matrix language.
                    </p>
                </div>

                <div className="lesson-overview__cards">
                    <article>
                        <span>Duration</span>
                        <strong>38 min</strong>
                    </article>
                    <article>
                        <span>Exercises</span>
                        <strong>6 tasks</strong>
                    </article>
                    <article>
                        <span>Difficulty</span>
                        <strong>Intermediate</strong>
                    </article>
                </div>
            </section>

            <section className="lesson-notes">
                <h3>Key Notes</h3>
                <ul>
                    <li>Every linear transformation can be represented by a matrix after a basis is chosen.</li>
                    <li>Composition of transformations matches matrix multiplication order.</li>
                    <li>The kernel and image describe what is lost and preserved by the transformation.</li>
                </ul>
            </section>

            <section className="content">
                <h3>Lesson Content</h3>
                <p>
                    In this lesson we will see how to represent linear transformations as matrices and how to use this representation to understand their properties.
                    We will start by reviewing the concept of a linear transformation and then show how to find the matrix representation of a transformation given a basis.
                    We will also see how to compute the kernel and image of a transformation using its matrix representation.
                </p>
            </section>

            <section className="lesson-resources">
                <h3>Resources</h3>
                <div className="lesson-resources__grid">
                    <article>
                        <span>Reading</span>
                        <p>Summary notes covering basis changes, standard matrices and worked examples.</p>
                    </article>
                </div>
            </section>
            <button>Next Lesson</button>
        </main>
    );
}
