import Header from '../components/header'
import Main from '../components/home_page/main'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'
import Comments from '../components/home_page/comments'

function HomePage() {
    return (
        <>
            <Header />
            <Main />
            <Comments />
            <CourseSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
