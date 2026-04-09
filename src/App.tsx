import { useState, useCallback, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BootSequence from './components/BootSequence'
import Navbar from './components/Navbar'

const Home     = lazy(() => import('./pages/Home'))
const BlogList = lazy(() => import('./pages/BlogList'))
const BlogPost = lazy(() => import('./pages/BlogPost'))

export default function App() {
  const [booted, setBooted] = useState(false)
  const handleBootDone = useCallback(() => setBooted(true), [])

  return (
    <BrowserRouter>
      <BootSequence onDone={handleBootDone} />
      {booted && (
        <>
          <Navbar />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"            element={<Home />} />
              <Route path="/blogs"       element={<BlogList />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
            </Routes>
          </Suspense>
        </>
      )}
    </BrowserRouter>
  )
}
