import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan', path: '/layanan-publik' },
    { name: 'UMKM', path: '/potensi-umkm' },
  ]

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 w-full z-50 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] select-none">
      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-surface-container-high/60">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <Link
            to="/"
            onClick={closeMenu}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
          >
            <img
              alt="Logo Pekon Margodadi"
              className="h-10 w-auto object-contain shrink-0"
              draggable={false}
              src="/favicon.svg"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg tracking-tight text-primary font-bold whitespace-nowrap leading-tight">
                Layanan Cerdas
              </span>
              <span className="text-base sm:text-lg tracking-tight text-primary font-bold whitespace-nowrap leading-tight">
                Pekon Margodadi
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={closeMenu}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer select-none ${isActive
                    ? 'bg-primary-container text-on-primary shadow-2xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action CTA & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/tanya-virtual-guide"
              onClick={closeMenu}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-xs whitespace-nowrap cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-lg leading-none">smart_toy</span>
              <span>Tanya disini</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer select-none"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 border-t border-surface-container-high bg-white shadow-lg">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={closeMenu}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className={({ isActive }) =>
                    `px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer select-none ${isActive
                      ? 'bg-primary-container text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
