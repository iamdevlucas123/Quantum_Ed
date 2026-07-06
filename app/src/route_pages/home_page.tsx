'use client'

import Header from '../components/header'
import Hero from '../components/home_page/hero'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'

function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main>
                <Hero />
                <CourseSection />
                <About />
            </main>
            <GithubFooter />
        </div>
    )
}

export default HomePage
