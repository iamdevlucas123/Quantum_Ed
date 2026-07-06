import { Suspense } from 'react'
import './styles/index.css'
import Loader from './components/loader'
import HomePage from './route_pages/home_page'

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <HomePage />
    </Suspense>
  )
}

export default App
