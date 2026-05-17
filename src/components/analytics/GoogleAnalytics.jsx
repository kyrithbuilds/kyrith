import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  bindAnalyticsClickTracking,
  initGoogleAnalytics,
  trackPageView,
} from '../../lib/analytics'

export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    initGoogleAnalytics()
    return bindAnalyticsClickTracking()
  }, [])

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`
    trackPageView(path)
  }, [location.pathname, location.search, location.hash])

  return null
}
