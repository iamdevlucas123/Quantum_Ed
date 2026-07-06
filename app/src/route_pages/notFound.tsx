
import '../styles/notFound.css'

export default function NotFound() {
    return (
        <main className="not-found">
            <section className="not-found__card">
                <p className="not-found__code">404</p>
                <h1>Page not found</h1>
                <p className="not-found__text">
                    The page you are looking for does not exist or is no longer available.
                </p>
                <a className="not-found__link" href="/">
                    Back to home
                </a>
            </section>
        </main>
    )
}
