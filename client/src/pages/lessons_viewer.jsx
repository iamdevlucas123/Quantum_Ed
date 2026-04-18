import '../styles/lessons_viewer.css';
import SideBar from '../components/lessons_viewer/sideBar';
import MainContent from '../components/lessons_viewer/mainContent';
import HeaderLessons from '../components/lessons_viewer/header_lessons';

function LessonsViewer() {
    return (
        <section className="lesson-viewer">
            <HeaderLessons />   
            <section className="lesson-layout">
                <SideBar />
                <MainContent />
            </section>
        </section>
    );
}

export default LessonsViewer;
