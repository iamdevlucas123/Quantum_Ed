
export default function CreateAccountSection() {
    return (
        <section id="intro-create-account">
            <div>
                <h2>Join QuantumEd Today!</h2>
                <p>Sign up for free and start your learning journey with us.</p>
                <p>130 interactive courses</p>
                <p>30 real projects</p>
                <p>1780 hours of content</p>
            </div>

            <div className="create-account-form">
                <h2>Create your free account</h2>
                <form action="/create-account" method="POST">
                    <input type="text" name="name" placeholder="Full Name" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Create Account</button>
                </form>
            </div>
            
        </section>
    )
}
