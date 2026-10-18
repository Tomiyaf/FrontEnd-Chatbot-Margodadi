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
        <div className="h-16 sm:h-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Title */}
          <Link
            to="/"
            onClick={closeMenu}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="flex items-center gap-2 sm:gap-3 min-w-0 cursor-pointer select-none"
          >
            <img
              alt="Logo Pekon Margodadi"
              className="h-8 sm:h-10 w-auto object-contain shrink-0"
              draggable={false}
              src="/favicon.svg"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-base tracking-tight text-primary font-bold truncate leading-tight">
                Layanan Cerdas
              </span>
              <span className="text-[11px] sm:text-base tracking-tight text-primary/85 font-bold truncate leading-tight">
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              to="/tanya-virtual-guide"
              onClick={closeMenu}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-xs whitespace-nowrap cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-base sm:text-lg leading-none">smart_toy</span>
              <span className="hidden xs:inline sm:inline">Tanya</span>
              <span className="hidden sm:inline">disini</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer select-none shrink-0"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 border-t border-surface-container-high bg-white shadow-lg animate-in slide-in-from-top-2 duration-150">
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
              <Link
                to="/tanya-virtual-guide"
                onClick={closeMenu}
                className="mt-2 flex items-center justify-center gap-2 bg-primary text-on-primary px-3.5 py-2.5 rounded-lg text-sm font-semibold shadow-xs"
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>Tanya Virtual Guide</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
