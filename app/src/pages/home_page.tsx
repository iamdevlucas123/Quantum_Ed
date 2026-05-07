import Header from '../components/header'
import Main from '../components/home_page/main_section'
import CourseSection from '../components/home_page/course_section'
import GithubFooter from '../components/github_footer'
import About from '../components/home_page/about'
import Comments from '../components/home_page/comments'
import CreateAccountSection from '../components/home_page/create_account'

function HomePage() {
    return (
        <>
            <Header />
            <Main />
            <Comments />
            <CourseSection />
            <CreateAccountSection />
            <About />
            <GithubFooter />
        </>
    )
}

export default HomePage
