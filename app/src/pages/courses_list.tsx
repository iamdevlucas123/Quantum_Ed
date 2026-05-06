import '../styles/courses_list.css'
import SearchInput from '../components/courses_list/serach_input'
import Header from '../components/header'
import MathList from '../components/courses_list/lists'
import GithubFooter from '../components/github_footer'

function CoursesList() {
    return (
        <>
            <Header />
            <SearchInput />
            <MathList />
            <GithubFooter />
        </>
    )
}

export default CoursesList