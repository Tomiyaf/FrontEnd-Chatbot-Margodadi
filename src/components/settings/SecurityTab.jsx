import React from 'react'

export default function SecurityTab({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  savingPassword,
  passwordMessage,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Keamanan &amp; Kata Sandi</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ganti kata sandi akun back-office untuk menjaga integritas akses sistem.
        </p>
      </div>

      {passwordMessage.text && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 ${
            passwordMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {passwordMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{passwordMessage.text}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Kata Sandi Saat Ini:
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Kata Sandi Baru:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Konfirmasi Kata Sandi Baru:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {savingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
          </button>
        </div>
      </form>
    </div>
  )
}
