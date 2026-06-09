import Header from "../components/header"
import GithubFooter from "../components/github_footer"
import CoursesFilters from "../components/courses_list/courses_filters"
import CoursesGrid from "../components/courses_list/courses_grid"
import "../styles/courses_list_css/courses_hero.css"

export default function Courses() {
    return(
        <>  
            <Header />
            <section className="courses-hero">
                <div className="courses-hero__copy">
                    <p className="courses-hero__eyebrow">Mission Catalog</p>
                    <h1>Choose your next technical flight path.</h1>
                    <p>
                        Browse structured tracks across mathematics, physics, software engineering
                        and quantum systems. Each course is mapped like an onboard training mission.
                    </p>
                    <div className="courses-hero__stats" aria-label="Course catalog summary">
                        <div>
                            <strong>24</strong>
                            <span>Tracks planned</span>
                        </div>
                        <div>
                            <strong>4</strong>
                            <span>Core academies</span>
                        </div>
                        <div>
                            <strong>Free</strong>
                            <span>Open access</span>
                        </div>
                    </div>
                </div>

                <div className="courses-hero__scene" aria-hidden="true">
                    <img className="courses-hero__planet" src="/assets/backgrounds/planet-forest-shadow.png" alt="" />
                    <img className="courses-hero__planet courses-hero__planet--secondary" src="/assets/backgrounds/planet-amber-shadow.png" alt="" />
                    <img className="courses-hero__station" src="/assets/sprites/orbital-solar-array-module.png" alt="" />
                    <img className="courses-hero__station courses-hero__station--gold" src="/assets/sprites/space-station-gold-module.png" alt="" />
                </div>
            </section>
            <CoursesFilters />
            <CoursesGrid />
            <GithubFooter />
        </>
    )
}
