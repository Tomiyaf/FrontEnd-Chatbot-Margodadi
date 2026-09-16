import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                M
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900 block leading-tight">
                  Pekon Margodadi
                </span>
                <span className="text-xs text-emerald-700 font-medium block">
                  Virtual Guide & Layanan Desa
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links Placeholder */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Beranda
            </NavLink>
            <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
              Profil Pekon (Placeholder)
            </span>
            <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
              Layanan & Info (Placeholder)
            </span>
            <span className="text-sm font-medium text-gray-400 cursor-not-allowed">
              Chatbot AI (Placeholder)
            </span>
          </nav>

          {/* Action / Back-Office Link */}
          <div className="flex items-center space-x-3">
            <Link
              to="/admin"
              className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
