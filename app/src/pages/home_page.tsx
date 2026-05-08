import Header from '../components/header'
import Hero from '../components/home_page/hero'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'
import Comments from '../components/home_page/comments'
import CreateAccountSection from '../components/home_page/account_form'

function HomePage() {
    return (
        <>
            <Header />
            <Hero />
            <Comments />
            <CourseSection />
            <CreateAccountSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
