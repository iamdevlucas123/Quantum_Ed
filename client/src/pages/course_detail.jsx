import '../styles/course_details.css'
import Header from '../components/header'
import GithubFooter from '../components/github_footer'
import CourseHero from '../components/course_details/coursesHero'
import CourseObjectives from '../components/course_details/courseObjectives'
import CourseContent from '../components/course_details/courseContent'

export default function courseDetail() {
    return (
        <>
            <Header />
            <CourseHero />
            <CourseObjectives />
            <CourseContent />
            <GithubFooter />
        </>
    )
}