import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import GoogleAnalytics from './components/analytics/GoogleAnalytics'
import ScrollToTop from './components/ScrollToTop'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServicePage from './pages/ServicePage'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bubble-developer" element={<ServicePage page="bubble-developer" />} />
          <Route path="/mvp-development" element={<ServicePage page="mvp-development" />} />
          <Route path="/workflow-automation" element={<ServicePage page="workflow-automation" />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
