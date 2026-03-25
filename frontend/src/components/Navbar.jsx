import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'হোম', to: '/' },
  { label: 'আমাদের সম্পর্কে', to: '/about-us' },
  { label: 'জিজ্ঞাসা', to: '/faq' },
  { label: 'নির্দেশনা', to: '/guide' },
  { label: 'যোগাযোগ', to: '/contact-us' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--green)' }}>
            <span className="text-white text-xs font-bold">OD</span>
          </div>
          <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--green)', fontFamily: 'Noto Serif Bengali, serif' }}>
            অর্ধেকদ্বীন
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium transition-colors hover:text-green-700 ${location.pathname === link.to ? 'text-green-700 border-b-2 border-green-700 pb-0.5' : 'text-gray-700'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border hover:bg-gray-50 transition" style={{ color: 'var(--green)' }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs" style={{ background: 'var(--green)' }}>
                  {user?.phone?.slice(-2) || 'U'}
                </div>
                <span className="hidden md:block">{user?.phone || 'আমার একাউন্ট'}</span>
                <span className="text-xs">▾</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border w-48 py-2 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>📋 ড্যাশবোর্ড</Link>
                  <Link to="/create-biodata" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>✏️ বায়োডাটা তৈরি</Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">🚪 লগআউট</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition hover:opacity-90" style={{ background: 'var(--green)' }}>
              লগইন
            </Link>
          )}
          <button className="lg:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700 mb-1" /><div className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-gray-700 py-1" onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          {isLoggedIn && (
            <>
              <Link to="/dashboard" className="text-sm text-gray-700 py-1" onClick={() => setMenuOpen(false)}>ড্যাশবোর্ড</Link>
              <button onClick={handleLogout} className="text-sm text-red-600 text-left py-1">লগআউট</button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
