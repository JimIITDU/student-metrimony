import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="text-white py-8 mt-12" style={{ background: 'var(--green-dark)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-green-800 text-xs font-bold">OD</span>
            </div>
            <span className="font-bold" style={{ fontFamily: 'Noto Serif Bengali, serif' }}>অর্ধেকদ্বীন</span>
          </div>

          <div className="flex gap-6 text-sm text-green-200">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
            <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
          </div>

          <a
            href="https://m.me/ordhekdeen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.318 5.51 3.396 7.26V22l3.204-1.753A11.18 11.18 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.437l-2.545-2.71-4.97 2.71 5.467-5.802 2.607 2.71 4.908-2.71-5.467 5.802z"/>
            </svg>
            Messenger
          </a>
        </div>

        <div className="text-center text-green-300 text-sm mt-6">
          © 2021-2026 ordhekdeen.com
        </div>
      </div>
    </footer>
  )
}
