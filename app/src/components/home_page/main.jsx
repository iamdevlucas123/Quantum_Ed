
export default function Main() {
    return(
        <main className="main">
            <h1>Welcome to QuantumEd</h1>
            <p>Build a strong foundation in Engineering, Mathematics and Physics</p>
            <button className="view-courses"
                onClick={() => window.location.href = '/courses'}
            >
                View all the courses
            </button>
        </main>
    )
}