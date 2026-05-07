import Header from '../components/header'
import Main from '../components/home_page/main'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'

function HomePage() {
    return (
        <>
            <Header />
            <Main />
            <CourseSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
