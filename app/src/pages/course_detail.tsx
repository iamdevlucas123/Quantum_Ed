import '../styles/course_detail_css/course_hero.css'
import '../styles/course_detail_css/course_meta.css'
import '../styles/course_detail_css/course_objectives.css'
import '../styles/course_detail_css/course_context.css'
import Header from '../components/header'
import GithubFooter from '../components/github_footer'
import CourseHero from '../components/course_details/courses_hero'
import CourseObjectives from '../components/course_details/course_objectives'
import CourseContent from '../components/course_details/course_content'

function courseDetail() {
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

export default courseDetail
