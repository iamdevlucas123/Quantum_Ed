import '../styles/home_page.css'
import Header from '../components/header'
import Main from '../components/home_page/main'
import CourseSection from '../components/home_page/course_section'
import VideoSection from '../components/home_page/video_section'
import GithubFooter from '../components/github_footer'

function HomePage() {
    return (
        <>
            <Header />
            <Main />
            <CourseSection />
            <VideoSection />
            <GithubFooter />
        </>
    )
}

export default HomePage