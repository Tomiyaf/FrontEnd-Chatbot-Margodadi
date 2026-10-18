import React, { useState, useRef } from 'react'
import settingService from '../../services/settingService'
import { useAuth } from '../../context/AuthContext'

export default function AvatarUploadModal({ isOpen, onClose, onUpdated }) {
  const { operator, updateOperator } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isResetToDefault, setIsResetToDefault] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const currentAvatar = operator?.avatar_url || '/favicon.svg'

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validasi ukuran (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal 5MB.')
      return
    }

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas yang dipilih harus berupa gambar (JPG, PNG, WebP, SVG).')
      return
    }

    setErrorMessage(null)
    setSelectedFile(file)
    setIsResetToDefault(false)

    // Preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSelectDefault = () => {
    setSelectedFile(null)
    setPreviewUrl('/favicon.svg')
    setIsResetToDefault(true)
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setIsUploading(true)
    setErrorMessage(null)

    try {
      let res
      if (isResetToDefault) {
        // Reset to default favicon
        res = await settingService.resetAvatar()
      } else if (selectedFile) {
        const formData = new FormData()
        formData.append('avatar', selectedFile)
        if (previewUrl && previewUrl.startsWith('data:image/')) {
          formData.append('avatar_base64', previewUrl)
        }
        res = await settingService.updateAvatar(formData)
      } else {
        // No changes
        onClose()
        return
      }

      if (res?.data?.operator) {
        updateOperator(res.data.operator)
        if (onUpdated) {
          onUpdated(res.data.operator)
        }
      }
      onClose()
    } catch (err) {
      console.error('Failed to update avatar:', err)
      setErrorMessage(
        err.response?.data?.message || 'Gagal memperbarui foto profil. Silakan coba lagi.'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const displayAvatar = isResetToDefault
    ? '/favicon.svg'
    : previewUrl || currentAvatar

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Ganti Foto Profil Anda
              </h2>
              <p className="text-[11px] text-slate-300">
                Ubah foto aparatur di sidebar dan sistem pelayanan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-rose-500 text-base shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Avatar Preview */}
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl ring-4 ring-emerald-500/20 bg-slate-100 flex items-center justify-center">
              <img
                src={displayAvatar}
                alt="Avatar Preview"
                onError={(e) => {
                  e.currentTarget.src = '/favicon.svg'
                }}
                className="w-full h-full object-cover"
              />
            </div>
            {isResetToDefault && (
              <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-slate-900 text-emerald-400 text-[10px] font-black rounded-full border border-slate-700 shadow-md">
                Favicon
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm">{operator?.name || 'Aparatur'}</h3>
            <p className="text-xs text-slate-400">
              {isResetToDefault
                ? 'Akan menggunakan Favicon resmi Pekon Margodadi sebagai foto profil bawaan'
                : selectedFile
                ? `Foto terpilih: ${selectedFile.name}`
                : operator?.avatar_url
                ? 'Foto profil kustom aktif saat ini'
                : 'Saat ini menggunakan Favicon bawaan'}
            </p>
          </div>

          {/* Action Choice Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              className="hidden"
            />

            {/* Choose from Device */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-base text-primary">upload_file</span>
              <span>Pilih Foto dari Perangkat</span>
            </button>

            {/* Reset to Favicon Default */}
            <button
              type="button"
              onClick={handleSelectDefault}
              className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isResetToDefault || (!operator?.avatar_url && !selectedFile)
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
              title="Gunakan Favicon resmi pekon sebagai foto profil default"
            >
              <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
              <span>Favicon Bawaan</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Format yang didukung: PNG, JPG, JPEG, WebP, SVG (Maks. 5MB).
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUploading || (!selectedFile && !isResetToDefault)}
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUploading && (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            )}
            <span>Simpan Foto</span>
          </button>
        </div>
      </div>
    </div>
  )
}
