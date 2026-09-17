import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { currentRole, activeOperator } = useOutletContext() || {}

  const [name, setName] = useState(activeOperator ? activeOperator.name : 'Budi Santoso')
  const [email, setEmail] = useState(
    activeOperator ? activeOperator.email : 'budi.santoso@margodadi.desa.id'
  )
  const [phone, setPhone] = useState(activeOperator?.phone || '0811-2233-4455')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Konfigurasi Sistem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola profil operator aparatur pekon, keamanan kata sandi, dan status integrasi gateway
        </p>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>Perubahan profil berhasil disimpan ke sistem!</span>
        </div>
      )}

      {/* Profil Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-base text-primary">person</span>
          Informasi Profil Aparatur Pekon
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-2">
            <img
              src={activeOperator?.avatar}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800">{name}</span>
              <p className="text-xs text-slate-500">
                Role saat ini:{' '}
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {currentRole || 'ADMIN'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Foto profil disinkronkan dengan data kepegawaian Pekon Margodadi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Kedinasan Pekon
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nomor Handphone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Wilayah Penugasan
              </label>
              <input
                type="text"
                disabled
                value="Pekon Margodadi (Kec. Sumberejo)"
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Ubah Password Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-base text-primary">lock</span>
          Keamanan & Ubah Kata Sandi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => alert('Fitur simulasi: Kata sandi berhasil diperbarui!')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Perbarui Kata Sandi
          </button>
        </div>
      </div>

      {/* Status Koneksi Integrasi Service (Chatwoot & RAG Gateway) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-base text-primary">settings_ethernet</span>
          Status Koneksi Sistem & Gateway Eksternal
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <span className="font-bold text-slate-900 block">Chatwoot API Gateway</span>
                <span className="text-[11px] text-slate-400">Sinkronisasi pesan WhatsApp & Web Inbox</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
              ONLINE & TERHUBUNG
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <span className="font-bold text-slate-900 block">RAG AI & Vector Database</span>
                <span className="text-[11px] text-slate-400">Retrieval Augmented Generation Margodadi</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
              ONLINE & TERHUBUNG
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <div>
                <span className="font-bold text-slate-900 block">Webhook Notifikasi HITL</span>
                <span className="text-[11px] text-slate-400">Pemicu antrean real-time ke aparatur</span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
              AKTIF
            </span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-950">Keluar dari Sesi Back-Office</h4>
          <p className="text-[11px] text-rose-700">
            Pastikan seluruh tiket penugasan yang Anda pegang telah ditindaklanjuti atau didelegasikan.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          Keluar (Logout)
        </button>
      </div>
    </div>
  )
}
