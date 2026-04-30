import '../styles/loader.css'

export default function Loader() {
    return (
        <div className="loader" role="status" aria-live="polite" aria-label="Loading page">
            <div className="loader__content">
                <p className="loader__brand">QuantumEd</p>
                <span className="loader__spinner" aria-hidden="true" />
            </div>
        </div>
    )
}
