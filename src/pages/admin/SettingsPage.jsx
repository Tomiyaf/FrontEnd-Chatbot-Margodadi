import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import settingService from '../../services/settingService'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { operator, logout } = useAuth()

  const [name, setName] = useState(operator?.name || 'Administrator')
  const [email, setEmail] = useState(operator?.email || 'admin@margodadi.desa.id')
  const [phone, setPhone] = useState(operator?.phone || '0811-2233-4455')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' })
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })

  // RAG Settings State
  const [ragSettings, setRagSettings] = useState({
    embedding_model: 'text-embedding-3-small',
    llm_model: 'gemini-1.5-flash',
    similarity_threshold: 0.75,
    top_k: 5,
    chunk_size: 512,
    chunk_overlap: 64,
    system_prompt: 'Anda adalah Virtual Guide resmi Pekon Margodadi...',
  })
  const [savingRag, setSavingRag] = useState(false)
  const [ragMessage, setRagMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (operator) {
      setName(operator.name || '')
      setEmail(operator.email || '')
      setPhone(operator.phone || '')
    }
  }, [operator])

  useEffect(() => {
    const fetchRag = async () => {
      try {
        const res = await settingService.getRagSettings()
        if (res?.data) {
          const cfg = res.data
          setRagSettings({
            embedding_model: cfg.embedding_model || 'text-embedding-3-small',
            llm_model: cfg.llm_model || 'gemini-1.5-flash',
            similarity_threshold: cfg.retrieval_config?.similarity_threshold ?? 0.75,
            top_k: cfg.retrieval_config?.top_k ?? 5,
            chunk_size: cfg.chunking_config?.chunk_size ?? 512,
            chunk_overlap: cfg.chunking_config?.chunk_overlap ?? 64,
            system_prompt: cfg.generation_config?.system_prompt ?? 'Anda adalah Virtual Guide resmi Pekon Margodadi...',
          })
        }
      } catch (err) {
        console.warn('Could not fetch RAG settings, using defaults:', err)
      }
    }
    fetchRag()
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMessage({ type: '', text: '' })
    try {
      const res = await settingService.updateProfile({ name, email, phone })
      if (res?.data?.operator) {
        localStorage.setItem('vg_operator', JSON.stringify(res.data.operator))
      }
      setProfileMessage({ type: 'success', text: 'Perubahan profil berhasil disimpan ke server!' })
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyimpan profil.',
      })
    } finally {
      setSavingProfile(false)
      setTimeout(() => setProfileMessage({ type: '', text: '' }), 4000)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: 'error', text: 'Mohon isi kata sandi saat ini dan kata sandi baru.' })
      return
    }
    if (newPassword.length < 3) {
      setPasswordMessage({ type: 'error', text: 'Kata sandi baru minimal 3 karakter.' })
      return
    }
    setSavingPassword(true)
    setPasswordMessage({ type: '', text: '' })
    try {
      await settingService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setPasswordMessage({ type: 'success', text: 'Kata sandi berhasil diperbarui!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal memperbarui kata sandi. Pastikan kata sandi lama benar.',
      })
    } finally {
      setSavingPassword(false)
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000)
    }
  }

  const handleSaveRag = async (e) => {
    e.preventDefault()
    setSavingRag(true)
    setRagMessage({ type: '', text: '' })
    try {
      await settingService.updateRagSettings({
        embedding_model: ragSettings.embedding_model,
        llm_model: ragSettings.llm_model,
        chunking_config: {
          chunk_size: parseInt(ragSettings.chunk_size, 10),
          chunk_overlap: parseInt(ragSettings.chunk_overlap, 10),
        },
        retrieval_config: {
          similarity_threshold: parseFloat(ragSettings.similarity_threshold),
          top_k: parseInt(ragSettings.top_k, 10),
        },
        generation_config: {
          system_prompt: ragSettings.system_prompt,
          temperature: 0.3,
        },
      })
      setRagMessage({ type: 'success', text: 'Konfigurasi RAG AI berhasil diperbarui!' })
    } catch (err) {
      setRagMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal memperbarui konfigurasi RAG.',
      })
    } finally {
      setSavingRag(false)
      setTimeout(() => setRagMessage({ type: '', text: '' }), 4000)
    }
  }

  const handleLogout = async () => {
    await logout()
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
          Kelola profil operator aparatur pekon, parameter RAG AI, keamanan kata sandi, dan status integrasi
        </p>
      </div>

      {/* Profil Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-base text-primary">person</span>
          Informasi Profil Aparatur Pekon
        </h3>

        {profileMessage.text && (
          <div
            className={`px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
              profileMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {profileMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{profileMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-2">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
              {name.charAt(0) || 'A'}
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-800">{name}</span>
              <p className="text-xs text-slate-500">
                Role saat ini:{' '}
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {operator?.role || 'OPERATOR'}
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Terhubung dengan basis data kepegawaian Pekon Margodadi.
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
                required
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
                required
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
              disabled={savingProfile}
              className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
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

        {passwordMessage.text && (
          <div
            className={`px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
              passwordMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {passwordMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{passwordMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Kata Sandi Saat Ini
              </label>
              <input
                type="password"
                placeholder="Kata sandi lama (misal: 123)"
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
                placeholder="Kata sandi baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {savingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
            </button>
          </div>
        </form>
      </div>

      {/* RAG AI Configuration Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">tune</span>
            Parameter RAG AI & Fallback Threshold (Human-in-the-Loop)
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-primary/10 text-primary">
            RAG Config v1.0
          </span>
        </div>

        {ragMessage.text && (
          <div
            className={`px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
              ragMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {ragMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{ragMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveRag} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Model LLM Generative
              </label>
              <input
                type="text"
                value={ragSettings.llm_model}
                onChange={(e) => setRagSettings({ ...ragSettings, llm_model: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Model Embeddings Vector
              </label>
              <input
                type="text"
                value={ragSettings.embedding_model}
                onChange={(e) => setRagSettings({ ...ragSettings, embedding_model: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Similarity Threshold (Batas Eskalasi HITL)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                value={ragSettings.similarity_threshold}
                onChange={(e) => setRagSettings({ ...ragSettings, similarity_threshold: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Jika kemiripan &lt; {ragSettings.similarity_threshold}, sistem otomatis mengalihkan ke antrean operator manusia.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Top-K Dokumen Relevan
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={ragSettings.top_k}
                onChange={(e) => setRagSettings({ ...ragSettings, top_k: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingRag}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {savingRag ? 'Menyimpan...' : 'Simpan Parameter RAG'}
            </button>
          </div>
        </form>
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
                <span className="font-bold text-slate-900 block">RAG AI & Vector Database (PostgreSQL)</span>
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

