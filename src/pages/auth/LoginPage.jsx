import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [username, setUsername] = useState('budi.santoso@margodadi.desa.id')
  const [password, setPassword] = useState('••••••••••')
  const [role, setRole] = useState('ADMIN')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/admin/dashboard')
    }, 600)
  }

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole)
    if (selectedRole === 'ADMIN') {
      setUsername('budi.santoso@margodadi.desa.id')
    } else {
      setUsername('siti.aminah@margodadi.desa.id')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white items-center justify-center font-black text-2xl shadow-xl shadow-primary/30 mb-2">
            VG
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Portal Back-Office Pekon
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sistem Monitoring Virtual Guide & Human-in-the-Loop Margodadi
          </p>
        </div>

        {/* Demo Credential Quick Selector */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary-fixed">info</span>
            Demo Akses Cepat Skripsi
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('ADMIN')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                role === 'ADMIN'
                  ? 'bg-primary text-white border-primary-fixed shadow-xs'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              👑 Admin Pekon
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('OPERATOR')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                role === 'OPERATOR'
                  ? 'bg-primary text-white border-primary-fixed shadow-xs'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/50'
              }`}
            >
              🎧 Operator Layanan
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email / Username Aparatur
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  account_circle
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
                <span>Ingat Sesi Ini</span>
              </label>
              <span className="text-primary hover:underline font-semibold cursor-pointer">
                Lupa Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  <span>Mengautentikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Kembali ke Halaman Publik Pekon Margodadi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
