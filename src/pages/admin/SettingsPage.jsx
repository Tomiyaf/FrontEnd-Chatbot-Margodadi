import React, { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import settingService from '../../services/settingService'
import TabSkeletonLoader from '../../components/common/TabSkeletonLoader'

// Lazy loaded sub-tabs
const ProfileTab = lazy(() => import('../../components/settings/ProfileTab'))
const SecurityTab = lazy(() => import('../../components/settings/SecurityTab'))
const RagEngineTab = lazy(() => import('../../components/settings/RagEngineTab'))

export default function SettingsPage() {
  const navigate = useNavigate()
  const { operator, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'rag'

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
        retrieval_config: {
          similarity_threshold: ragSettings.similarity_threshold,
          top_k: ragSettings.top_k,
        },
        chunking_config: {
          chunk_size: ragSettings.chunk_size,
          chunk_overlap: ragSettings.chunk_overlap,
        },
        generation_config: {
          system_prompt: ragSettings.system_prompt,
        },
      })
      setRagMessage({ type: 'success', text: 'Parameter AI Vector Store & RAG berhasil diperbarui!' })
    } catch (err) {
      setRagMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal menyimpan konfigurasi RAG.',
      })
    } finally {
      setSavingRag(false)
      setTimeout(() => setRagMessage({ type: '', text: '' }), 4000)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar dari sesi back-office?')) {
      await logout()
      navigate('/login')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-slate-700">settings</span>
          <h1 className="text-2xl font-bold text-slate-900">Pengaturan Sistem &amp; Akun</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Kelola profil aparatur operator, keamanan sandi, dan parameter engine AI RAG Pekon Margodadi.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">person</span>
          <span>Profil Akun</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">lock</span>
          <span>Keamanan Sandi</span>
        </button>

        <button
          onClick={() => setActiveTab('rag')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'rag'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">tune</span>
          <span>Parameter RAG AI</span>
        </button>
      </div>

      {/* Active Tab Rendering with Suspense */}
      <Suspense fallback={<TabSkeletonLoader rows={3} title="Memuat Pengaturan..." />}>
        {activeTab === 'profile' && (
          <ProfileTab
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            savingProfile={savingProfile}
            profileMessage={profileMessage}
            onSubmit={handleSaveProfile}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            savingPassword={savingPassword}
            passwordMessage={passwordMessage}
            onSubmit={handleChangePassword}
          />
        )}

        {activeTab === 'rag' && (
          <RagEngineTab
            ragSettings={ragSettings}
            setRagSettings={setRagSettings}
            savingRag={savingRag}
            ragMessage={ragMessage}
            onSubmit={handleSaveRag}
          />
        )}
      </Suspense>

      {/* Logout Banner */}
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-rose-950">Keluar dari Sesi Back-Office</h4>
          <p className="text-[11px] text-rose-700">
            Pastikan seluruh tiket penugasan yang Anda pegang telah ditindaklanjuti.
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
