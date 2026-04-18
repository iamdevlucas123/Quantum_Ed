import { Routes, Route} from 'react-router-dom'
import '../src/styles/index.css'
import HomePage from './pages/home_page'
import CoursesList from './pages/courses_list'
import CourseDetail from './pages/course_detail'
import LessonsViewer from './pages/lessons_viewer'
import GlobalLoader, { useGlobalLoading } from './components/globalLoader'

function App() {
  const isLoading = useGlobalLoading()

  return (
    <>
      {isLoading && <GlobalLoader />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/lessons/:id" element={<LessonsViewer />} />
        {/* Dev routes */}
        <Route path="/dev/lessons-viewer" element={<LessonsViewer />} />
        <Route path="/dev/course-detail" element={<CourseDetail />} />
      </Routes>
    </>
  )
}

export default App
