import Header from "../components/header"
import GithubFooter from "../components/github_footer"
import CoursesFilters from "../components/courses_list/courses_filters"
import CoursesGrid from "../components/courses_list/courses_grid"
import "../styles/courses_list_css/courses_hero.css"

export default function Courses() {
    return(
        <>  
            <Header />
            <CoursesFilters />
            <CoursesGrid />
            <GithubFooter />
        </>
    )
}
