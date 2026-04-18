

export default function HeaderLessons() {

    return (
        <div className="lesson-viewer__topbar">
                <div className="lesson-viewer__topbar-left">
                    <button type="button" className="lesson-viewer__icon-button" aria-label="Go back">
                        &#8592;
                    </button>
                    <div className="lesson-viewer__brand">
                        <span><img src="/path/to/logo.png" alt="QuantumEd Logo" /></span>
                        <span>QuantumEd</span>
                    </div>
                </div>

            </div>
    )
}