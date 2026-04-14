import { Routes, Route } from 'react-router-dom'
import '../src/styles/index.css'
import HomePage from './pages/home_page'
import CoursesList from './pages/courses_list'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesList />} />
      </Routes>
    </>
  )
}

export default App
