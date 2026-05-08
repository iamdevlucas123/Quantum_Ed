import Header from "../components/header"
import GithubFooter from "../components/github_footer"
import CoursesFilters from "../components/courses_list/courses_filters"
import CoursesGrid from "../components/courses_list/courses_grid"

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
