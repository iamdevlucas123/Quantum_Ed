import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import './styles/index.css'
import Loader from './components/loader'

const HomePage = lazy(() => import('./pages/home_page'))
const CoursesList = lazy(() => import('./pages/courses_list'))
const CourseDetail = lazy(() => import('./pages/course_detail'))
const LessonsViewer = lazy(() => import('./pages/lessons_viewer'))
const NotFound = lazy(() => import('./pages/notFound'))

function App() {
  return (
    // The Suspense component is used to show a fallback (Loader) while the lazy-loaded components are being fetched
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/lessons/:id" element={<LessonsViewer />} />
        <Route path="*" element={<NotFound />} />
        {/* Dev routes */}
        <Route path="/dev/lessons-viewer" element={<LessonsViewer />} />
        <Route path="/dev/course-detail" element={<CourseDetail />} />
      </Routes>
    </Suspense>
  )
}

export default App
