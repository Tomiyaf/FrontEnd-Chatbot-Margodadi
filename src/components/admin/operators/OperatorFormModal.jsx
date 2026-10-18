import React, { useState, useEffect, useRef, useCallback } from 'react'
import operatorService from '../../../services/operatorService'

export default function OperatorFormModal({
  isOpen,
  onClose,
  onSaved,
  editingOperator = null,
  currentUserId = null,
}) {
  const isEditMode = Boolean(editingOperator)

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'OPERATOR',
    password: '',
    avatar_url: '',
    is_active: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [generalError, setGeneralError] = useState(null)

  // Real-time verification status for username & email
  // Status: 'idle' | 'checking' | 'valid' | 'invalid' | 'taken'
  const [usernameVerify, setUsernameVerify] = useState({
    status: 'idle',
    message: '',
  })
  const [emailVerify, setEmailVerify] = useState({
    status: 'idle',
    message: '',
  })

  const debounceTimerRef = useRef(null)

  // Initialize or reset form on open/editingOperator change
  useEffect(() => {
    if (isOpen) {
      if (editingOperator) {
        setFormData({
          name: editingOperator.name || '',
          username: editingOperator.username || '',
          email: editingOperator.email || '',
          phone: editingOperator.phone !== '-' ? editingOperator.phone || '' : '',
          role: editingOperator.role || 'OPERATOR',
          password: '', // Blank by default when editing; fill only if resetting
          avatar_url: editingOperator.avatar || '',
          is_active: editingOperator.is_active ?? true,
        })
        setUsernameVerify({ status: 'valid', message: 'Username terdaftar' })
        setEmailVerify({ status: 'valid', message: 'Email terdaftar' })
      } else {
        setFormData({
          name: '',
          username: '',
          email: '',
          phone: '',
          role: 'OPERATOR',
          password: '',
          avatar_url: '',
          is_active: true,
        })
        setUsernameVerify({ status: 'idle', message: '' })
        setEmailVerify({ status: 'idle', message: '' })
      }
      setFormErrors({})
      setGeneralError(null)
      setShowPassword(false)
    }
  }, [isOpen, editingOperator])

  // Real-time verification handler for username & email
  const verifyCredentials = useCallback(
    async (username, email) => {
      const uTrimmed = username.trim().toLowerCase()
      const eTrimmed = email.trim().toLowerCase()

      // 1. Format check for username
      const usernameRegex = /^[a-zA-Z0-9._-]+$/
      let skipUsernameApi = false
      if (!uTrimmed) {
        setUsernameVerify({ status: 'idle', message: '' })
        skipUsernameApi = true
      } else if (uTrimmed.length < 3) {
        setUsernameVerify({
          status: 'invalid',
          message: 'Username minimal 3 karakter',
        })
        skipUsernameApi = true
      } else if (!usernameRegex.test(uTrimmed)) {
        setUsernameVerify({
          status: 'invalid',
          message: 'Hanya huruf, angka, titik, strip, dan underscore',
        })
        skipUsernameApi = true
      }

      // 2. Format check for email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      let skipEmailApi = false
      if (!eTrimmed) {
        setEmailVerify({ status: 'idle', message: '' })
        skipEmailApi = true
      } else if (!emailRegex.test(eTrimmed)) {
        setEmailVerify({
          status: 'invalid',
          message: 'Format email belum valid',
        })
        skipEmailApi = true
      }

      if (skipUsernameApi && skipEmailApi) return

      // Set state to checking for valid formats
      if (!skipUsernameApi) {
        setUsernameVerify({ status: 'checking', message: 'Memeriksa ketersediaan...' })
      }
      if (!skipEmailApi) {
        setEmailVerify({ status: 'checking', message: 'Memeriksa ketersediaan...' })
      }

      try {
        const res = await operatorService.checkAvailability({
          username: !skipUsernameApi ? uTrimmed : undefined,
          email: !skipEmailApi ? eTrimmed : undefined,
          exclude_id: editingOperator?.operator_id,
        })

        if (res?.data) {
          if (!skipUsernameApi) {
            if (res.data.username_available) {
              setUsernameVerify({
                status: 'valid',
                message: '✓ Username tersedia & terverifikasi',
              })
            } else {
              setUsernameVerify({
                status: 'taken',
                message: '✕ Username sudah digunakan oleh akun lain',
              })
            }
          }

          if (!skipEmailApi) {
            if (res.data.email_available) {
              setEmailVerify({
                status: 'valid',
                message: '✓ Email tersedia & terverifikasi',
              })
            } else {
              setEmailVerify({
                status: 'taken',
                message: '✕ Email sudah terdaftar pada akun lain',
              })
            }
          }
        }
      } catch (err) {
        console.error('Failed to verify credentials:', err)
      }
    },
    [editingOperator]
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const nextVal = type === 'checkbox' ? checked : value

    setFormData((prev) => {
      const updated = { ...prev, [name]: nextVal }

      // Trigger debounced verification if username or email changes
      if (name === 'username' || name === 'email') {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          verifyCredentials(
            name === 'username' ? nextVal : updated.username,
            name === 'email' ? nextVal : updated.email
          )
        }, 350)
      }

      return updated
    })

    // Clear specific error field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  // Generate random secure password helper
  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$'
    let generated = ''
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, password: generated }))
    setShowPassword(true)
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    setGeneralError(null)

    // Pre-validation checks
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Nama lengkap aparatur wajib diisi.'
    if (!formData.username.trim()) errors.username = 'Username wajib diisi.'
    if (usernameVerify.status === 'taken') errors.username = 'Username sudah digunakan oleh akun lain.'
    if (usernameVerify.status === 'invalid') errors.username = 'Format username tidak valid.'

    if (!formData.email.trim()) errors.email = 'Email kedinasan wajib diisi.'
    if (emailVerify.status === 'taken') errors.email = 'Email sudah terdaftar pada akun lain.'
    if (emailVerify.status === 'invalid') errors.email = 'Format email tidak valid.'

    if (!isEditMode && !formData.password.trim()) {
      errors.password = 'Password akun awal wajib diisi.'
    } else if (formData.password.trim() && formData.password.trim().length < 6) {
      errors.password = 'Password minimal terdiri dari 6 karakter.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: formData.name.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        avatar_url: formData.avatar_url.trim() || null,
        is_active: formData.is_active,
      }

      if (formData.password.trim()) {
        payload.password = formData.password.trim()
      }

      let res
      if (isEditMode) {
        res = await operatorService.updateOperator(editingOperator.operator_id, payload)
      } else {
        res = await operatorService.createOperator(payload)
      }

      if (onSaved) {
        onSaved(res?.data || payload)
      }
      onClose()
    } catch (err) {
      console.error('Failed to save operator:', err)
      const respData = err.response?.data
      if (respData?.errors) {
        setFormErrors(respData.errors)
      } else if (respData?.message) {
        setGeneralError(respData.message)
      } else {
        setGeneralError('Terjadi kesalahan saat menyimpan data akun operator.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const isEditingSelf = Boolean(
    isEditMode && currentUserId && editingOperator?.operator_id === currentUserId
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light">
              <span className="material-symbols-outlined text-2xl">
                {isEditMode ? 'badge' : 'person_add'}
              </span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                {isEditMode ? 'Edit Profil & Akun Aparatur' : 'Tambah Akun Aparatur Baru'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300">
                {isEditMode
                  ? `Perbarui informasi, peran, atau reset password #${editingOperator.id || editingOperator.operator_id}`
                  : 'Daftarkan petugas operator pelayanan atau admin sistem Back-Office'}
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4.5 max-h-[78vh] overflow-y-auto">
          {/* General Error Alert */}
          {generalError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-rose-500 text-base shrink-0 mt-0.5">
                error
              </span>
              <span>{generalError}</span>
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Aparatur <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                person
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Drs. Bambang Santoso"
                className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                  formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-primary'
                }`}
              />
            </div>
            {formErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">info</span>
                {Array.isArray(formErrors.name) ? formErrors.name[0] : formErrors.name}
              </p>
            )}
          </div>

          {/* Username & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Username with Real-Time Verification */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Username <span className="text-rose-500">*</span>
                </label>
                {/* Real-time Indicator Badge */}
                {usernameVerify.status === 'checking' && (
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium animate-pulse">
                    <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    Cek...
                  </span>
                )}
                {usernameVerify.status === 'valid' && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Terverifikasi
                  </span>
                )}
                {usernameVerify.status === 'taken' && (
                  <span className="text-[10px] text-rose-600 flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-xs">cancel</span>
                    Sudah Dipakai
                  </span>
                )}
                {usernameVerify.status === 'invalid' && (
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Tidak Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  alternate_email
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="bambang.santoso"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    usernameVerify.status === 'taken' || formErrors.username
                      ? 'border-rose-400 bg-rose-50/20'
                      : usernameVerify.status === 'valid'
                      ? 'border-emerald-400 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-primary'
                  }`}
                />
              </div>
              {usernameVerify.message && (
                <p
                  className={`text-[10.5px] mt-1 flex items-center gap-1 ${
                    usernameVerify.status === 'valid'
                      ? 'text-emerald-600'
                      : usernameVerify.status === 'taken' || usernameVerify.status === 'invalid'
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                >
                  {usernameVerify.message}
                </p>
              )}
              {formErrors.username && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {Array.isArray(formErrors.username) ? formErrors.username[0] : formErrors.username}
                </p>
              )}
            </div>

            {/* Email with Real-Time Verification */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Email Kedinasan <span className="text-rose-500">*</span>
                </label>
                {/* Real-time Indicator Badge */}
                {emailVerify.status === 'checking' && (
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium animate-pulse">
                    <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    Cek...
                  </span>
                )}
                {emailVerify.status === 'valid' && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Terverifikasi
                  </span>
                )}
                {emailVerify.status === 'taken' && (
                  <span className="text-[10px] text-rose-600 flex items-center gap-0.5 font-bold">
                    <span className="material-symbols-outlined text-xs">cancel</span>
                    Sudah Dipakai
                  </span>
                )}
                {emailVerify.status === 'invalid' && (
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5 font-medium">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    Format Salah
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="bambang@margodadi.desa.id"
                  className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                    emailVerify.status === 'taken' || formErrors.email
                      ? 'border-rose-400 bg-rose-50/20'
                      : emailVerify.status === 'valid'
                      ? 'border-emerald-400 focus:border-emerald-500'
                      : 'border-slate-200 focus:border-primary'
                  }`}
                />
              </div>
              {emailVerify.message && (
                <p
                  className={`text-[10.5px] mt-1 flex items-center gap-1 ${
                    emailVerify.status === 'valid'
                      ? 'text-emerald-600'
                      : emailVerify.status === 'taken' || emailVerify.status === 'invalid'
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                >
                  {emailVerify.message}
                </p>
              )}
              {formErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1">
                  {Array.isArray(formErrors.email) ? formErrors.email[0] : formErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Role Akses & Nomor Telepon Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Role Akses */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Peran Akses Sistem <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isEditingSelf}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'OPERATOR' }))}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    formData.role === 'OPERATOR'
                      ? 'bg-primary/10 border-primary text-slate-900 ring-2 ring-primary/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  } ${isEditingSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">support_agent</span>
                    <span className="text-xs font-bold">OPERATOR</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Intervensi HITL & Layanan</span>
                </button>

                <button
                  type="button"
                  disabled={isEditingSelf}
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'ADMIN' }))}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                    formData.role === 'ADMIN'
                      ? 'bg-purple-50 border-purple-400 text-purple-950 ring-2 ring-purple-200'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  } ${isEditingSelf ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-purple-600">shield_person</span>
                    <span className="text-xs font-bold">ADMIN</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Akses Penuh Kelola Sistem</span>
                </button>
              </div>
            </div>

            {/* Nomor Telepon / WA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. HP / WhatsApp <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  call
                </span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-3456-7890"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <p className="text-[10.5px] text-slate-400 mt-1">Untuk koordinasi penugasan tiket darurat pekon.</p>
            </div>
          </div>

          {/* Password Section with Reset Note */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-amber-500">lock_reset</span>
                  {isEditMode ? 'Reset Password Aparatur' : 'Password Akun Baru'}
                  {!isEditMode && <span className="text-rose-500">*</span>}
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isEditMode
                    ? 'Kosongkan jika tidak ingin mengubah password. Isi jika aparatur lupa password.'
                    : 'Tetapkan password awal untuk aparatur masuk ke sistem.'}
                </p>
              </div>

              {/* Generate Random Password Helper */}
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Buat password acak yang aman"
              >
                <span className="material-symbols-outlined text-xs text-primary">magic_button</span>
                <span>Acak Sandi</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditMode ? 'Masukkan password baru jika ingin mereset...' : 'Minimal 6 karakter sandi...'}
                className={`w-full pl-3.5 pr-10 py-2 bg-white border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono ${
                  formErrors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? 'Sembunyikan' : 'Lihat'}
              >
                <span className="material-symbols-outlined text-base">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {formErrors.password && (
              <p className="text-[11px] text-rose-600 mt-0.5">
                {Array.isArray(formErrors.password) ? formErrors.password[0] : formErrors.password}
              </p>
            )}
          </div>

          {/* Status Keaktifan Akun (Checkbox) */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-xl ${formData.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                {formData.is_active ? 'check_circle' : 'do_not_disturb_on'}
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Status Akun Aktif</span>
                <span className="text-[10.5px] text-slate-500">
                  {formData.is_active
                    ? 'Aparatur dapat login dan menerima penugasan tiket warga'
                    : 'Akun dinonaktifkan sementara dan tidak dapat login'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                disabled={isEditingSelf}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || usernameVerify.status === 'taken' || emailVerify.status === 'taken'}
              className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && (
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
              )}
              <span>{isEditMode ? 'Simpan Perubahan' : 'Daftarkan Akun'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
