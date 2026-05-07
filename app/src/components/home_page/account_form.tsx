
import '../../styles/account_form.css';

export default function CreateAccountSection() {
    return (
        <section id="intro-create-account">
            <div className="account-intro">
                <h2>
                    Join with our <strong>family of developers</strong> and start your learning journey today!
                </h2>

                <div className="account-stats">
                    <div>
                        <strong>100+</strong>
                        <p>Courses</p>
                    </div>
                    <div>
                        <strong>30+</strong>
                        <p>Real Projects</p>
                    </div>
                    <div>
                        <strong>745+</strong>
                        <p>Hours of Content</p>
                    </div>
                </div>
            </div>

            <div className="create-account-form">
                <h2>Create Your Free Account</h2>

                <div className="account-socials" aria-label="Social sign up options">
                    <button type="button" aria-label="Sign up with Google">G</button>
                    <button type="button" aria-label="Sign up with GitHub">⌘</button>
                    <button type="button" aria-label="Sign up with Apple">●</button>
                    <button type="button" aria-label="Sign up with LinkedIn">in</button>
                </div>

                <form action="/create-account" method="POST">
                    <label>
                        Full Name
                        <input type="text" name="name" placeholder="Full Name" required />
                    </label>
                    <label>
                        Email
                        <input type="email" name="email" placeholder="Email" required />
                    </label>
                    <label>
                        Password
                        <input type="password" name="password" placeholder="Password" required />
                    </label>
                    <button type="submit">Get Started for Free</button>
                </form>
            </div>
        </section>
    )
}
