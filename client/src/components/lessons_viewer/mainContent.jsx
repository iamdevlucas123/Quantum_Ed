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
            </section>

            <section className="content">
                <h3>Content</h3>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dicta minus totam officia eligendi. Omnis totam sequi facilis quisquam quis nemo, minus rem ullam, veritatis vitae, iste quae ipsam exercitationem.</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut accusamus dignissimos, officia id quasi quae cupiditate deserunt a eligendi pariatur facilis sapiente voluptatum voluptatibus quia magni tempore! Expedita, omnis ex.</p>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero mollitia laboriosam reprehenderit non veniam, quod atque eum excepturi qui, accusantium eius maiores velit omnis modi delectus dolore, ea illo rem?</p>
            </section>

            <section className="key-resume">
                <h3>Key Resume</h3>
                <ul>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo dicta minus totam officia eligendi.</li>
                    <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut accusamus dignissimos, officia id quasi quae cupiditate deserunt a eligendi pariatur facilis sapiente voluptatum voluptatibus quia magni tempore! Expedita, omnis ex.</li>
                    <li>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero mollitia laboriosam reprehenderit non veniam, quod atque eum excepturi qui, accusantium eius maiores velit omnis modi delectus dolore, ea illo rem?</li>
                </ul>
            </section>
            <footer className="pass-lesson">
                <button className="next-lesson">Next Lesson</button>
                <button className="previous-lesson">Previous Lesson</button>
            </footer>
        </main>
    );
}
