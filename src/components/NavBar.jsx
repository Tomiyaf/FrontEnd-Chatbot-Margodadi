import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Layanan', path: '/layanan-publik' },
    { name: 'UMKM', path: '/potensi-umkm' },
    { name: 'Edukasi Sampah', path: '/edukasi-sampah' },
  ]

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="sticky top-0 w-full z-50 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] select-none">
      {/* Top Announcement Bar */}
      {/* <div className="bg-primary text-on-primary py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0">
              <span className="material-symbols-outlined text-sm leading-none">campaign</span>
              PENGUMUMAN
            </span>
            <span className="text-xs text-on-primary/90 hidden sm:inline truncate">
              Musrenbang Pekon Margodadi Tahun 2025 dibuka untuk aspirasi warga.
            </span>
          </div>
          <div className="flex items-center gap-4 text-on-primary/90 text-xs ml-auto whitespace-nowrap shrink-0">
            <div className="hidden md:flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm leading-none">schedule</span>
              <span>Senin - Jumat: 08.00 - 15.30 WIB</span>
            </div>
            <a
              className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary hover:bg-tertiary-container px-2.5 py-1 rounded-full text-xs cursor-pointer select-none"
              href="https://wa.me/6282177890112"
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            >
              <span className="material-symbols-outlined text-sm leading-none">chat</span>
              <span>Hotline Pekon</span>
            </a>
          </div>
        </div>
      </div>*/}

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
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPe1K5bFZag-QlGF_nAYci7bYZJVVtbJ-RT5pVN18dDJE_oY4Oz2b7UDOIbqnagbLxUivEV8Nor8IX6D-NMIgrINsXIvhw4EDkZe5NWj3gjlHinh6XOyjGoLaJlBrosZYXQoeUCYJqSs8k3q-jawedVUm6YE01bMTD1qiL4wcT2_Vs7252HBzk4ir_AMJvKshNatdiv0ZnJPblKLE-JNJv4OQhqUGCFB_bV5UnGDuHTjjbVxSxCjM"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg tracking-tight text-primary font-bold whitespace-nowrap leading-tight">
                Virtual Guide
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
                  `px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer select-none ${
                    isActive
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
              <span>Tanya Virtual Guide</span>
            </Link>

            <Link
              to="/admin"
              onClick={closeMenu}
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              className="flex items-center gap-2 pl-1 hover:opacity-90 cursor-pointer select-none"
              title="Akses Portal Admin"
            >
              <img
                alt="Profile"
                draggable={false}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJiUP4EFFyg8VmjNLkwguRcXBjHsTg2Olj4mZ1siG7OraQdbZeP3aQwyjsFgIniDHuZbZ2obeUOt1VGMVYvAkw6RL938E_ITdYilQUixmB87yUPJan6gDJ8yU6ts9Yl6Fvk1MJaS4PFMyJ5zHMIpur7IAzzepXzed2D_jTV9B3KBewWmhCGQDQ3SUahhSze9_twdBPmGFXqpTYJSV0Jto8tAF22ainVvZiuUW81ZhoiX1WJTAw0r0"
              />
              <div className="hidden 2xl:flex flex-col text-left whitespace-nowrap">
                <span className="text-xs font-semibold text-on-surface leading-tight">Dewi Lestari</span>
                <span className="text-[11px] text-on-surface-variant leading-tight">Layanan Warga</span>
              </div>
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
                    `px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap cursor-pointer select-none ${
                      isActive
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
