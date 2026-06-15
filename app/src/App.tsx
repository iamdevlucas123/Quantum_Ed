import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import './styles/index.css'
import Loader from './components/loader'
import RequireAuth from './components/require_auth'
import { useAuthStore } from './context/auth_store'

const HomePage = lazy(() => import('./pages/home_page'))
const CoursesList = lazy(() => import('./pages/courses_list'))
const CourseDetail = lazy(() => import('./pages/course_detail'))
const LessonsViewer = lazy(() => import('./pages/lessons_viewer'))
const NotFound = lazy(() => import('./pages/notFound'))
const Profile = lazy(() => import('./pages/profile'))

function App() {
  const refreshSession = useAuthStore((state) => state.refreshSession)

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  return (
    // The Suspense component is used to show a fallback (Loader) while the lazy-loaded components are being fetched
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesList />} />
        <Route path="/courses/:courseSlug" element={<CourseDetail />} />
        <Route element={<RequireAuth />}>
          <Route path="/courses/:courseSlug/lessons/:lessonSlug" element={<LessonsViewer />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
