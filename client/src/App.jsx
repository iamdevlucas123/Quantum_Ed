import { Routes, Route } from 'react-router-dom'
import '../src/styles/index.css'
import HomePage from './pages/home_page'
import CoursesList from './pages/courses_list'
import CourseDetail from './pages/course_detail'
import LessonsViewer from './pages/lessons_viewer'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/lessons/:id" element={<LessonsViewer />} />
      </Routes>
    </>
  )
}

export default App
