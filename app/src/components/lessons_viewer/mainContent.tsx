export default function MainContent() {
    return (
        <main className="main-content">
            <nav className="main-content__breadcrumb" aria-label="Breadcrumb">
                <span>Home</span>
                <span>&#8250;</span>
                <span>Courses</span>
                <span>&#8250;</span>
                <span>Learn Node.js</span>
            </nav>

            <section className="lesson-hero">
                <div className="lesson-hero__copy">
                    <p className="lesson-hero__eyebrow">Current Lesson</p>
                    <h1>Introduction to Node.js</h1>
                    <p>
                        Get introduced to Node.js, its primary use cases, and the core features that make it
                        powerful for back-end development.
                    </p>
                </div>

                <div className="lesson-hero__tools" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </section>

            <section className="lesson-article">
                <p>
                    Welcome. You are about to dive into Node.js, one of the most versatile and popular
                    technologies for back-end development. Node.js allows us to use JavaScript, a language
                    you may already know from front-end work, on the server side as well. This opens up a
                    new world of possibilities for APIs, tools and modern web applications.
                </p>

                <h2>What is Node.js?</h2>
                <p>
                    <strong>Node.js</strong> is an open-source, cross-platform runtime environment that allows
                    us to execute JavaScript code outside a browser. Traditionally, JavaScript was used almost
                    exclusively to create interactive interfaces on the web. Node.js changed that by making it
                    practical to run JavaScript on servers, in command-line tools and in automation workflows.
                </p>

                <p>
                    Its event-driven architecture and non-blocking I/O model make it especially effective for
                    applications that need to handle many concurrent requests. That is one of the reasons why
                    it became a strong option for APIs, real-time apps and scalable service layers.
                </p>
            </section>

            <section className="lesson-keypoints">
                <h3>Key takeaways</h3>
                <ul>
                    <li>Node.js lets JavaScript run beyond the browser, especially in server-side environments.</li>
                    <li>It is widely used for APIs, tooling, real-time systems and fast iteration in full-stack teams.</li>
                    <li>Its architecture is built around event-driven patterns and efficient handling of asynchronous work.</li>
                </ul>
            </section>

            <footer className="lesson-navigation">
                <button type="button" className="lesson-navigation__button lesson-navigation__button--secondary">
                    Previous lesson
                </button>
                <button type="button" className="lesson-navigation__button">
                    Next lesson
                </button>
            </footer>
        </main>
    );
}
