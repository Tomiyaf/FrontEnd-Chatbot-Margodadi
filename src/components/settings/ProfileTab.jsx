import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import AvatarUploadModal from '../admin/AvatarUploadModal'

export default function ProfileTab({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  savingProfile,
  profileMessage,
  onSubmit,
}) {
  const { operator } = useAuth()
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const currentAvatar = operator?.avatar_url || '/favicon.svg'

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Informasi Profil Aparatur</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Perbarui foto profil, identitas akun aparatur, dan kontak resmi pelayanan desa.
        </p>
      </div>

      {profileMessage.text && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 ${
            profileMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {profileMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{profileMessage.text}</span>
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-300 bg-white shadow-xs flex items-center justify-center">
            <img
              src={currentAvatar}
              alt="Foto Profil"
              onError={(e) => {
                e.currentTarget.src = '/favicon.svg'
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
            title="Ganti Foto Profil"
          >
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h3 className="text-sm font-bold text-slate-800">Foto Profil Aparatur</h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              operator?.avatar_url
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {operator?.avatar_url ? 'Foto Kustom' : 'Favicon Bawaan'}
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-lg">
            Foto ini ditampilkan pada bilah samping (sidebar), header, dan riwayat penanganan tiket. Jika belum diatur, sistem otomatis menggunakan Favicon resmi Pekon Margodadi sebagai gambar default bawaan.
          </p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">edit</span>
              <span>Ganti Foto Mandiri</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nama Lengkap Aparatur:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Alamat Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nomor Telepon / WhatsApp Dinas:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>

      {/* Modal Upload Avatar */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  )
}
