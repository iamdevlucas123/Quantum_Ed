import '../styles/home_page.css'
import Header from '../components/home_page/header'
import Main from '../components/home_page/main'
import CourseSection from '../components/home_page/course_section'
import VideoSection from '../components/home_page/video_section'
import GithubFooter from '../components/home_page/github_footer'

export default function HomePage() {
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