import '../styles/lessons_viewer.css'
import Header from '../components/header'
import SideBar from '../components/lessons_viewer/sideBar'
import MainContent from '../components/lessons_viewer/mainContent'

function LessonsViewer() {

    return(
        <>
            <Header />
            <SideBar />
            <MainContent />
        </>
    )
}

export default LessonsViewer