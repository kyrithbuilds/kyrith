import {
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import fullLogo from '../assets/Full Logo.svg'
import circleLogo from '../assets/Circle Logo.svg'
import { CTA } from '../config/analytics'
import { mainNavItems } from '../config/navigation'

const SCROLL_THRESHOLD = 8

const navLinkClass = ({ isActive }) =>
  `relative pb-1.5 text-sm tracking-tight transition-all duration-300 ease-out ${
    isActive
      ? 'font-bold text-secondary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-secondary/45'
      : 'font-semibold text-primary hover:text-secondary'
  }`

function useScrollScrolled() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrolled
}

function HamburgerIcon({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
      aria-hidden
    >
      {open ? (
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

const ctaClass =
  'inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-[#2E5CE6] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:scale-[0.98] sm:min-h-0 sm:px-6 sm:py-2.5'

const mobileLinkClass = (isActive) =>
  `block w-full rounded-xl border-l-[3px] px-3 py-3.5 text-base tracking-tight transition-all duration-200 sm:px-4 sm:py-4 ${
    isActive
      ? 'border-secondary bg-white/45 font-bold text-secondary'
      : 'border-transparent font-semibold text-primary hover:bg-white/40'
  }`

export default function Navbar() {
  const scrolled = useScrollScrolled()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuTopPx, setMenuTopPx] = useState(96)
  const shellRef = useRef(null)
  const location = useLocation()

  const updateShellMetrics = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    const bottom = el.getBoundingClientRect().bottom
    setMenuTopPx(Math.round(bottom + 10))
  }, [])

  useLayoutEffect(() => {
    updateShellMetrics()
    window.addEventListener('scroll', updateShellMetrics, { passive: true })
    window.addEventListener('resize', updateShellMetrics)
    const ro = new ResizeObserver(updateShellMetrics)
    const node = shellRef.current
    if (node) ro.observe(node)
    return () => {
      window.removeEventListener('scroll', updateShellMetrics)
      window.removeEventListener('resize', updateShellMetrics)
      ro.disconnect()
    }
  }, [updateShellMetrics])

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), [])

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false)
    })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useLayoutEffect(() => {
    if (mobileOpen) updateShellMetrics()
  }, [mobileOpen, updateShellMetrics])

  const glassShell =
    'rounded-2xl border border-white/30 bg-white/60 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 ease-out ' +
    (scrolled
      ? 'bg-white/70 shadow-[0_2px_12px_-2px_rgba(2,29,65,0.06),0_1px_3px_rgba(2,29,65,0.04)]'
      : 'shadow-sm')

  return (
    <header className="sticky top-0 z-50 w-full pt-3 pb-2 sm:pt-4">
      <div className="mx-auto w-full max-w-container px-3 sm:px-5 lg:px-8">
        <div ref={shellRef} className={glassShell}>
          <div className="flex min-h-[52px] items-center justify-between gap-2 px-3 py-2 sm:min-h-[56px] sm:gap-4 sm:px-5 sm:py-2.5 lg:gap-6">
            <Link
              to="/"
              className="flex min-w-0 shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              <img
                src={fullLogo}
                alt="KyrithBuilds"
                className="hidden h-9 w-auto max-h-9 max-w-[min(100%,200px)] object-contain object-left sm:max-h-9 lg:block"
              />
              <img
                src={circleLogo}
                alt="KyrithBuilds"
                className="h-9 w-9 shrink-0 object-contain sm:h-9 sm:w-9 lg:hidden"
              />
            </Link>

            <nav
              className="hidden items-center gap-12 xl:gap-14 lg:flex"
              aria-label="Main navigation"
            >
              {mainNavItems.map(({ to, label, end }) => (
                <NavLink key={to} to={to} className={navLinkClass} end={end}>
                  {label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className={`${ctaClass} ml-0.5`}
                data-track-cta={CTA.GET_IN_TOUCH}
                data-track-location="navbar_desktop"
              >
                Get in Touch
              </Link>
            </nav>

            <button
              type="button"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary transition-colors duration-200 hover:bg-white/50 lg:hidden"
              onClick={toggleMobile}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: below floating pill, aligned with page gutters */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] lg:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ top: menuTopPx }}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 z-0 bg-primary/20 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobile}
          tabIndex={mobileOpen ? 0 : -1}
          aria-label="Close menu"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-container justify-center px-3 sm:px-5 lg:px-8">
          <div
            className={`w-full overflow-hidden transition-[max-height] duration-300 ease-out ${
              mobileOpen ? 'max-h-[min(82dvh,600px)]' : 'max-h-0'
            }`}
          >
            <nav
              id="mobile-nav"
              className={`mt-2 rounded-2xl border border-white/30 bg-white/60 shadow-sm backdrop-blur-xl transition-opacity duration-300 ease-out ${
                mobileOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex flex-col gap-2 px-3 py-5 sm:gap-3 sm:px-5 sm:py-6">
                {mainNavItems.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => mobileLinkClass(isActive)}
                    end={end}
                    onClick={closeMobile}
                  >
                    {label}
                  </NavLink>
                ))}
                <Link
                  to="/contact"
                  className={`${ctaClass} mt-4 w-full`}
                  data-track-cta={CTA.GET_IN_TOUCH}
                  data-track-location="navbar_mobile"
                  onClick={closeMobile}
                >
                  Get in Touch
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
