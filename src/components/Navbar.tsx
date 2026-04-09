import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'experience', href: '/#experience' },
  { label: 'projects',   href: '/#projects' },
  { label: 'blogs',      href: '/blogs' },
  { label: 'contact',   href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    if (!href.startsWith('/#')) {
      navigate(href)
      return
    }
    const id = href.slice(2)
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Navigate home then scroll after mount
      navigate('/')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }

  const linkStyle = (active?: boolean): React.CSSProperties => ({
    color: active ? '#00ff41' : '#666',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.875rem',
    textDecoration: 'none',
    padding: 0,
  })

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1a' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" style={{ color: '#00ff41', textDecoration: 'none' }}>
          <span className="font-mono text-sm font-semibold glow-green">bala@systems:~$</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => {
            const isActive = link.href === '/blogs' && location.pathname.startsWith('/blogs')
            return (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                style={linkStyle(isActive)}
                onMouseEnter={e => (e.currentTarget.style.color = '#00ff41')}
                onMouseLeave={e => (e.currentTarget.style.color = isActive ? '#00ff41' : '#666')}
              >
                ./{link.label}
              </button>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-mono text-sm"
          style={{ color: '#00ff41', background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? '[close]' : '[menu]'}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 space-y-3"
          style={{ background: 'rgba(10,10,10,0.98)' }}
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left font-mono text-sm py-1"
              style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ./{link.label}
            </button>
          ))}
        </div>
      )}
    </motion.nav>
  )
}
