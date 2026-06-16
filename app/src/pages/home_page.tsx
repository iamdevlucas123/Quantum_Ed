import Header from '../components/header'
import Hero from '../components/home_page/hero'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'

function HomePage() {
    return (
        <>
            <Header />
            <Hero />
            <CourseSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
