import Header from '../components/header'
import Hero from '../components/home_page/hero'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'
import Comments from '../components/home_page/comments'
import CookieConsentModal from '../components/home_page/cookie_consent_modal'

function HomePage() {
    return (
        <>
            <Header />
            <CookieConsentModal />
            <Hero />
            <Comments />
            <CourseSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
