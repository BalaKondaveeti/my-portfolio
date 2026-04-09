import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BootSequence from './components/BootSequence'
import Navbar from './components/Navbar'

// Preload all chunks at module init so they're ready before boot ends
const homeImport     = import('./pages/Home')
const blogListImport = import('./pages/BlogList')
const blogPostImport = import('./pages/BlogPost')

const Home     = lazy(() => homeImport)
const BlogList = lazy(() => blogListImport)
const BlogPost = lazy(() => blogPostImport)

export default function App() {
  // Render content immediately behind the boot overlay (z-50).
  // By the time boot finishes, chunks are already loaded → zero wait.
  return (
    <BrowserRouter>
      <BootSequence />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/my_blogs"        element={<BlogList />} />
          <Route path="/my_blogs/:slug"  element={<BlogPost />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
