import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'
import { useAuth } from '../context/AuthContext'
import conversationService from '../services/conversationService'

export default function AdminLayout() {
  const { operator, logout } = useAuth()
  const currentRole = operator?.role || 'ADMIN'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [hitlQueueCount, setHitlQueueCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  // Authenticated operator details from database
  const activeOperator = {
    id: operator?.operator_id ? `OP-${String(operator.operator_id).padStart(2, '0')}` : 'OP-01',
    name: operator?.name || 'Aparatur Desa',
    email: operator?.email || 'admin@margodadi.desa.id',
    role: operator?.role || 'ADMIN',
    avatar:
      operator?.avatar_url ||
      (currentRole === 'ADMIN'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
  }

  // Fetch real HITL counter from DB
  useEffect(() => {
    let isMounted = true
    const fetchHitlCount = async () => {
      try {
        const res = await conversationService.getConversations({ status: 'NEED_HUMAN', per_page: 1 })
        if (isMounted && res?.meta) {
          setHitlQueueCount(res.meta.total || 0)
        }
      } catch (err) {
        console.warn('Failed to load HITL queue count:', err)
      }
    }

    fetchHitlCount()
    const interval = setInterval(fetchHitlCount, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'dashboard',
      roles: ['ADMIN', 'OPERATOR'],
    },
    {
      label: 'Percakapan (Inbox)',
      path: '/admin/conversations',
      icon: 'forum',
      badge: hitlQueueCount > 0 ? `${hitlQueueCount} HITL` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      roles: ['ADMIN', 'OPERATOR'],
    },
    {
      label: 'Manajemen Operator',
      path: '/admin/operators',
      icon: 'badge',
      roles: ['ADMIN'],
    },
    {
      label: 'Analitik Layanan',
      path: '/admin/analytics',
      icon: 'analytics',
      roles: ['ADMIN'],
    },
    {
      label: 'Monitoring Edukasi',
      path: '/admin/education',
      icon: 'school',
      roles: ['ADMIN'],
    },
    {
      label: 'Laporan Layanan',
      path: '/admin/reports',
      icon: 'summarize',
      roles: ['ADMIN'],
    },
    {
      label: 'Export Data Riset',
      path: '/admin/research-export',
      icon: 'ios_share',
      roles: ['ADMIN'],
    },
    {
      label: 'Activity Log',
      path: '/admin/activity-log',
      icon: 'history',
      roles: ['ADMIN'],
    },
    {
      label: 'Pengaturan Sistem',
      path: '/admin/settings',
      icon: 'settings',
      roles: ['ADMIN', 'OPERATOR'],
    },
  ]

  const visibleNavItems = navigationItems.filter((item) =>
    item.roles.includes(currentRole)
  )

  const getPageTitle = () => {
    const current = navigationItems.find(
      (item) => location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin')
    )
    if (location.pathname.startsWith('/admin/conversations/')) {
      return 'Detail Percakapan Warga'
    }
    return current ? current.label : 'Panel Administrasi'
  }

  return (
    <div className="min-h-screen flex bg-slate-100/90 text-slate-800 font-body">
      <ScrollToTop />

      {/* Backdrop for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col shrink-0 shadow-2xl transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              VG
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm text-white tracking-wide">
                  Virtual Guide HITL
                </h1>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Pekon Margodadi Back-Office</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Real Authenticated Role Info */}
        <div className="p-3.5 mx-3 mt-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
            <span className="text-xs font-bold text-slate-200">{activeOperator.role === 'ADMIN' ? 'Administrator Pekon' : 'Operator Layanan'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            Terautentikasi
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm font-medium">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama
          </div>

          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/30 space-y-2">
          {/* Quick Active Operator Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <img
              src={activeOperator.avatar}
              alt={activeOperator.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-600 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{activeOperator.name}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{activeOperator.role} · Online</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Web Publik</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Dashboard Monitoring & Human-in-the-Loop Management Layer
              </p>
            </div>
          </div>

          {/* Top Actions & Quick HITL Alert Bell */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick HITL Button */}
            <Link
              to="/admin/conversations?status=NEED_HUMAN"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-xs font-bold shadow-2xs"
            >
              <span className="material-symbols-outlined text-base animate-spin text-rose-600">
                crisis_alert
              </span>
              <span className="hidden md:inline">Antrian HITL:</span>
              <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded-md text-[11px]">
                {hitlQueueCount} Butuh Aksi
              </span>
            </Link>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 relative transition-colors cursor-pointer"
                title="Notifikasi Masuk"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {hitlQueueCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800">Notifikasi Real-time</span>
                    <span
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[10px] text-primary font-bold cursor-pointer hover:underline"
                    >
                      Tutup
                    </span>
                  </div>
                  <div className="py-2 space-y-2.5 max-h-72 overflow-y-auto">
                    {hitlQueueCount > 0 ? (
                      <div
                        onClick={() => {
                          setNotificationsOpen(false)
                          navigate('/admin/conversations?status=NEED_HUMAN')
                        }}
                        className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 hover:bg-rose-100/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-800">
                            Eskalasi HITL Membutuhkan Respon
                          </span>
                          <span className="text-[10px] text-rose-600 font-mono">Live</span>
                        </div>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          Terdapat {hitlQueueCount} tiket eskalasi warga yang memerlukan bantuan operator.
                        </p>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        Tidak ada notifikasi baru
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC CHILD PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet context={{ activeOperator, hitlQueueCount }} />
          </div>
        </main>
      </div>
    </div>
  )
}
