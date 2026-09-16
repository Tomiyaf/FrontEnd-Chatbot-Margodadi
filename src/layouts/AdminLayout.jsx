import { Link, NavLink, Outlet } from 'react-router-dom'
import ScrollToTop from '../components/ScrollToTop'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      <ScrollToTop />
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 shadow-lg">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
            ADM
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide">Back-Office</h1>
            <p className="text-[11px] text-slate-400">Pekon Margodadi</p>
          </div>
        </div>

        {/* Navigation Placeholder */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-sm font-medium">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span>📊</span>
            <span>Dashboard</span>
          </NavLink>

          <div className="pt-4 pb-2 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Manajemen (Placeholder)
          </div>

          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 rounded-lg hover:bg-slate-800/50 cursor-not-allowed">
            <span>🤖</span>
            <span>Data Knowledge AI</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 rounded-lg hover:bg-slate-800/50 cursor-not-allowed">
            <span>📋</span>
            <span>Layanan Administrasi</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-2 text-slate-400 rounded-lg hover:bg-slate-800/50 cursor-not-allowed">
            <span>⚙️</span>
            <span>Pengaturan Sistem</span>
          </div>
        </nav>

        {/* Bottom Back to Public Link */}
        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            ← Kembali ke Publik
          </Link>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-2xs">
          <div className="text-sm font-semibold text-gray-700">
            Panel Administrasi & Pengelolaan Chatbot
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
              Role: Admin Pekon
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
