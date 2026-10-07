import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import chatbotService from '../../services/chatbotService'

const initialMessages = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: 'Halo Warga Pekon Margodadi! Saya **Virtual Guide resmi Pekon Margodadi**. Ada yang dapat saya bantu terkait administrasi surat, syarat perizinan, produk UMKM desa, atau panduan pengelolaan sampah mandiri hari ini?',
    timestamp: '09:15 WIB',
  },
]

export default function TanyaVirtualGuidePage() {
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState(initialMessages)
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('vg_public_session') || '')
  const [anonymousCode, setAnonymousCode] = useState(() => localStorage.getItem('vg_citizen_code') || '')
  const [conversationId, setConversationId] = useState(null)

  const [inputText, setInputText] = useState(() => {
    const promptQuery = searchParams.get('prompt')
    const layananQuery = searchParams.get('layanan')
    const umkmQuery = searchParams.get('umkm')

    if (promptQuery) return promptQuery
    if (layananQuery) return `Apa saja berkas persyaratan dan alur permohonan untuk ${layananQuery}?`
    if (umkmQuery) return `Halo, saya ingin menanyakan ketersediaan produk dan kontak dari UMKM ${umkmQuery}.`
    return ''
  })
  const [isTyping, setIsTyping] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState({})
  const dialogueContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const idCounterRef = useRef(100)

  const getNextId = (prefix = 'msg') => {
    idCounterRef.current += 1
    return `${prefix}-${idCounterRef.current}`
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 3200)
  }

  // Init session on mount
  useEffect(() => {
    const initChatbot = async () => {
      try {
        const res = await chatbotService.initSession({
          session_id: sessionId || undefined,
          anonymous_code: anonymousCode || undefined,
        })
        if (res?.data) {
          setSessionId(res.data.session_id)
          setAnonymousCode(res.data.anonymous_code)
          setConversationId(res.data.conversation_id)
          localStorage.setItem('vg_public_session', res.data.session_id)
          localStorage.setItem('vg_citizen_code', res.data.anonymous_code)
        }
      } catch (err) {
        console.warn('Failed to init chatbot session:', err)
      }
    }
    initChatbot()
  }, [])

  // Sync operator messages in real-time when in an active conversation
  useEffect(() => {
    if (!conversationId) return

    const syncInterval = setInterval(async () => {
      try {
        const res = await chatbotService.syncMessages({ conversation_id: conversationId })
        if (res?.data?.messages && res.data.messages.length > 0) {
          const serverMessages = res.data.messages
          setMessages((prevMessages) => {
            // Find any operator messages from server not yet in local state
            const missingOpMessages = serverMessages.filter(
              (sm) => sm.sender === 'operator' && !prevMessages.some((pm) => pm.text === sm.text)
            )

            if (missingOpMessages.length > 0) {
              return [...prevMessages, ...missingOpMessages]
            }
            return prevMessages
          })
        }
      } catch (err) {
        // Silent catch for background polling
      }
    }, 5000)

    return () => clearInterval(syncInterval)
  }, [conversationId])

  // Scroll chat messages container on new message without moving whole window
  useEffect(() => {
    if (dialogueContainerRef.current) {
      dialogueContainerRef.current.scrollTo({
        top: dialogueContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isTyping])

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInputText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`

    const userMessage = {
      id: getNextId('usr'),
      sender: 'user',
      text,
      timestamp: currentTime,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setIsTyping(true)
    try {
      const res = await chatbotService.sendMessage({
        message: text,
        session_id: sessionId || undefined,
        anonymous_code: anonymousCode || undefined,
        citizen_name: 'Warga Margodadi',
      })

      if (res?.data?.message) {
        const botReply = res.data.message
        if (res.data.conversation_id) {
          setConversationId(res.data.conversation_id)
        }

        if (botReply.needsHuman) {
          const handoverNotice = {
            id: getNextId('handover'),
            sender: 'system',
            text: 'Eskalasi Diskresi Administrasi Diaktifkan. Sistem secara otomatis menghubungkan percakapan ke Aparatur Pekon Margodadi.',
            timestamp: currentTime,
          }
          setMessages((prev) => [...prev, handoverNotice, botReply])
        } else {
          setMessages((prev) => [...prev, botReply])
        }
      }
    } catch (err) {
      console.error('Chatbot request error:', err)
      const errorMsg = {
        id: getNextId('err'),
        sender: 'bot',
        text: 'Mohon maaf, terjadi kendala saat menghubungi server basis pengetahuan Pekon Margodadi. Silakan coba kembali sesaat lagi.',
        timestamp: currentTime,
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const triggerHandoverNotice = async () => {
    handleSend('Saya butuh bantuan langsung atau berbicara dengan operator aparatur pekon.')
    showToast('Menghubungkan ke Aparatur Pekon...')
  }

  const clearDialogue = () => {
    if (window.confirm('Bersihkan riwayat percakapan saat ini dan mulai sesi baru?')) {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`
      const freshSessionId = `SESS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      setSessionId(freshSessionId)
      localStorage.setItem('vg_public_session', freshSessionId)

      setMessages([
        {
          id: getNextId('fresh'),
          sender: 'bot',
          text: 'Halo Warga Pekon Margodadi! Sesi konsultasi baru telah dibuka. Silakan ajukan pertanyaan terkait layanan publik, syarat surat, UMKM, atau program lingkungan desa.',
          timestamp: currentTime,
        },
      ])
      showToast('Sesi percakapan berhasil dibersihkan.')
    }
  }

  const handleFeedback = async (msgId, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [msgId]: type }))
    try {
      await chatbotService.submitFeedback({
        conversation_id: conversationId,
        rating: type === 'up' ? 5 : 2,
        comment: type === 'up' ? 'Ulasan positif warga: informasi membantu.' : 'Ulasan warga: perlu penyempurnaan.',
      })
      showToast(
        type === 'up'
          ? 'Terima kasih atas ulasan positif Anda!'
          : 'Umpan balik dicatat untuk penyempurnaan akurasi RAG.'
      )
    } catch (err) {
      console.warn('Failed to submit feedback:', err)
    }
  }

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('Browser Anda belum mendukung input suara Web Speech API. Silakan ketik pertanyaan.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'id-ID'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsVoiceActive(true)
      showToast('Mendengarkan suara Anda... Silakan berbicara.')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsVoiceActive(false)
      showToast(`Terdengar: "${transcript}"`)
    }

    recognition.onerror = () => {
      setIsVoiceActive(false)
      showToast('Tidak ada suara terdeteksi atau mikrofon dinonaktifkan.')
    }

    recognition.onend = () => {
      setIsVoiceActive(false)
    }

    recognition.start()
  }

  const simulateUpload = () => {
    showToast('Modul Lampiran: Anda dapat menyertakan foto KTP/KK/Berkas ke loket Balai Pekon.')
  }

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* 1. TOP CONTEXT & LIVE SYSTEM STATUS RIBBON */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-4 sm:p-5 rounded-2xl shadow-xs border border-surface-container-high/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-on-surface">
                  Pusat Konsultasi Terpadu &amp; RAG Virtual
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Panduan resmi administrasi kependudukan, perizinan usaha, dan koordinasi aparatur Pekon
                Margodadi.
              </p>
            </div>
          </div>

        </div>

        {/* 2. MAIN DUAL-COLUMN INTERACTIVE CANVAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: Context & Guidance Panel ================= */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">

            {/* Recommended Topic Pills */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high/60 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
                  Rekomendasi Topik Warga
                </h4>
              </div>
              <p className="text-xs text-on-surface-variant">
                Klik topik instan untuk langsung menanyakan ke asisten:
              </p>
              <div className="flex flex-col gap-2 pt-1">
                {[
                  {
                    title: 'Apa syarat membuat Surat Keterangan Usaha (SKU)?',
                    label: 'Syarat Surat SKU Usaha Mikro',
                  },
                  {
                    title: 'Bagaimana cara mendaftar nasabah Bank Sampah Pekon?',
                    label: 'Pendaftaran Bank Sampah Pekon',
                  },
                  {
                    title: 'Katalog kerajinan bambu khas Margodadi & kontak pengrajin',
                    label: 'Katalog Kerajinan Anyaman Bambu',
                  },
                  {
                    title: 'Jadwal pelayanan perekaman e-KTP keliling di kecamatan',
                    label: 'Jadwal Rekam e-KTP Keliling',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="text-left w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface text-xs font-medium transition-all flex items-center justify-between group cursor-pointer border border-surface-container-high/30"
                    onClick={() => handleSend(item.title)}
                    type="button"
                  >
                    <span className="line-clamp-1">{item.label}</span>
                    <span className="material-symbols-outlined text-sm opacity-60 group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Effective Query Guidelines */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-xs border border-surface-container-high/60 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined text-lg">lightbulb</span>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">Tips Pertanyaan Efektif</h3>
              </div>
              <ul className="space-y-2 text-xs text-on-surface-variant leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Sebutkan jenis layanan spesifik:</strong> misalnya SKU, SKTM, Surat
                    Domisili, atau Izin Keramaian.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Tanyakan alur &amp; jam operasional:</strong> tanyakan berkas yang perlu
                    dibawa ke balai pekon.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Akses program desa:</strong> informasi bibit tani, pupuk subsidi, katalog
                    UMKM, serta jadwal TPS3R.
                  </span>
                </li>
              </ul>
            </div>

            {/* Human Escalation Callout Panel */}
            <div className="bg-gradient-to-br from-primary via-primary-container to-teal-950 p-5 rounded-2xl text-on-primary shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-secondary-fixed">
                  support_agent
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-on-primary">Butuh Validasi Fisik?</h4>
              </div>
              <p className="text-xs text-on-primary/85 leading-relaxed">
                Jika membutuhkan legalisir stempel basah atau berkas khusus, petugas pelayanan siap
                melayani di Loket Balai Pekon atau via WhatsApp resmi.
              </p>
              <div className="pt-1">
                <a
                  className="inline-flex items-center justify-center gap-2 w-full bg-surface-container-lowest text-primary text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-surface transition-colors shadow-xs"
                  href="https://wa.me/6282177890112"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Hubungi Loket via WhatsApp</span>
                </a>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT COLUMN: Structured Dialogue Workspace ================= */}
          <section className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-3xl shadow-sm border border-surface-container-high/60 min-h-[720px] overflow-hidden">
            {/* Conversation Header Bar */}
            <div className="p-4 sm:p-5 bg-surface-container-lowest flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-high/50">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-surface-container-lowest"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-on-surface">
                      Asisten Virtual Pekon Margodadi
                    </h2>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">bolt</span>
                    <span>Didukung Retrieval-Augmented Generation &amp; Verifikasi Arsip Pekon</span>
                  </p>
                </div>
              </div>

              {/* Interaction Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                  onClick={triggerHandoverNotice}
                  title="Alihkan percakapan ke operator manusia"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-secondary">
                    transfer_within_a_station
                  </span>
                  <span className="hidden sm:inline">Hubungkan Operator</span>
                </button>
                <button
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-error transition-colors cursor-pointer"
                  onClick={clearDialogue}
                  title="Bersihkan riwayat percakapan"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">delete_sweep</span>
                </button>
              </div>
            </div>

            {/* Chat Stream Workspace */}
            <div
              ref={dialogueContainerRef}
              className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto bg-surface-container-low/30 max-h-[580px] min-h-[460px]"
              id="dialogueContainer"
            >
              {/* Timestamp Divider */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-on-surface-variant bg-surface-container px-3.5 py-1 rounded-full font-medium">
                  Sesi Konsultasi Virtual Terpadu Margodadi
                </span>
              </div>

              {/* Message List Rendering */}
              {messages.map((msg) => {
                // Case 1: System Transition Banner
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-start gap-3 p-3.5 bg-secondary-fixed text-on-secondary-fixed rounded-2xl shadow-2xs">
                        <span className="material-symbols-outlined text-xl shrink-0 text-secondary mt-0.5">
                          handshake
                        </span>
                        <div className="flex-1 text-xs">
                          <span className="font-bold block mb-0.5">
                            Eskalasi Diskresi Administrasi Diaktifkan
                          </span>
                          <span className="leading-relaxed">{msg.text}</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0 mt-1"></span>
                      </div>
                    </div>
                  )
                }

                // Case 2: Human Operator Message
                if (msg.sender === 'operator') {
                  return (
                    <div
                      key={msg.id}
                      className="flex items-start gap-3 max-w-3xl animate-in fade-in duration-200"
                    >
                      <div className="relative shrink-0 mt-1">
                        <img
                          alt={msg.operatorName || 'Petugas'}
                          className="w-9 h-9 rounded-xl object-cover shadow-xs ring-2 ring-primary"
                          src={msg.operatorAvatar}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest"></span>
                      </div>
                      <div className="space-y-1.5 w-full">
                        <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-xs border border-surface-container-high/50 space-y-3">
                          {/* Operator Info Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-container-high/40">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-on-surface">
                                {msg.operatorName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                                {msg.operatorRole}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium">
                              <span className="material-symbols-outlined text-xs">verified_user</span>
                              Aparatur Terverifikasi
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                            {msg.text}
                          </div>

                          {/* Quick Action by Operator */}
                          <div className="pt-1 flex flex-wrap gap-2">
                            <a
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                              href="https://wa.me/6282177890112"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span className="material-symbols-outlined text-sm text-primary">
                                chat
                              </span>
                              <span>Chat Petugas di WA</span>
                            </a>
                            <button
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                              onClick={() =>
                                handleSend('Saya akan mengonfirmasi kedatangan ke Balai Pekon Margodadi.')
                              }
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm">send</span>
                              <span>Konfirmasi Kedatangan</span>
                            </button>
                          </div>
                        </div>
                        <span className="text-[11px] text-on-surface-variant px-1 block">
                          {msg.timestamp} • Ditangani Petugas Langsung
                        </span>
                      </div>
                    </div>
                  )
                }

                // Case 3: User Message Bubble
                if (msg.sender === 'user') {
                  return (
                    <div
                      key={msg.id}
                      className="flex items-start justify-end gap-3 animate-in fade-in duration-200"
                    >
                      <div className="space-y-1 max-w-xl text-right">
                        <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none shadow-xs text-left">
                          <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <div className="flex items-center justify-end gap-1 px-1 text-on-surface-variant text-[11px]">
                          <span>{msg.timestamp}</span>
                          <span className="material-symbols-outlined text-xs text-primary">
                            done_all
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }

                // Case 4: Bot Message Bubble (with Rich RAG Content)
                return (
                  <div
                    key={msg.id}
                    className="flex items-start gap-3 max-w-3xl animate-in fade-in duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <span className="material-symbols-outlined text-base">smart_toy</span>
                    </div>
                    <div className="space-y-2 w-full">
                      <div className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl rounded-tl-none shadow-xs border border-surface-container-high/50 space-y-4">
                        <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </p>

                        {/* Rich Checkpoints Card */}
                        {msg.richContent?.checkpoints && (
                          <div className="bg-surface-container-low p-3.5 sm:p-4 rounded-xl space-y-2.5 border border-surface-container-high/40">
                            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base">fact_check</span>
                              Dokumen / Rincian Terkait:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-on-surface text-xs">
                              {msg.richContent.checkpoints.map((chk, cidx) => (
                                <div
                                  key={cidx}
                                  className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-lg border border-surface-container-high/30"
                                >
                                  <span className="material-symbols-outlined text-primary text-base shrink-0">
                                    check_circle
                                  </span>
                                  <span className="leading-snug">{chk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* SLA & Fee Badges */}
                        {(msg.richContent?.sla || msg.richContent?.fee) && (
                          <div className="flex flex-wrap items-center gap-3 p-3 bg-surface-container rounded-xl text-xs">
                            {msg.richContent.sla && (
                              <div className="flex items-center gap-1.5 text-on-surface">
                                <span className="material-symbols-outlined text-primary text-base">
                                  timer
                                </span>
                                <span>
                                  Waktu Proses: <strong>{msg.richContent.sla}</strong>
                                </span>
                              </div>
                            )}
                            {msg.richContent.fee && (
                              <div className="flex items-center gap-1.5 text-on-surface">
                                <span className="material-symbols-outlined text-primary text-base">
                                  payments
                                </span>
                                <span>
                                  Biaya:{' '}
                                  <strong className="text-primary font-bold">
                                    {msg.richContent.fee}
                                  </strong>
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Expandable Citation / RAG Reference Accordion */}
                        {msg.richContent?.citation && (
                          <details className="group bg-surface-container-low rounded-xl p-3 text-on-surface transition-all cursor-pointer border border-surface-container-high/40">
                            <summary className="text-xs font-semibold text-primary flex items-center justify-between list-none select-none">
                              <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-base">description</span>
                                Sumber Rujukan: {msg.richContent.citation.title}
                              </span>
                              <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                                expand_more
                              </span>
                            </summary>
                            <div className="pt-3 text-xs text-on-surface-variant space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                                <span>
                                  Parameter Pencocokan: {msg.richContent.citation.similarity}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
                                  Relevansi {msg.richContent.citation.relevance}
                                </span>
                              </div>
                              <p className="italic bg-surface-container-lowest p-2.5 rounded-lg text-xs leading-relaxed text-on-surface border border-surface-container-high/30">
                                {msg.richContent.citation.quote}
                              </p>
                            </div>
                          </details>
                        )}

                        {/* Action Controls for Citations */}
                        {msg.richContent?.actions && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {msg.richContent.actions.map((act, aidx) => (
                              <Link
                                key={aidx}
                                to={act.link}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-2xs"
                              >
                                {act.icon && (
                                  <span className="material-symbols-outlined text-sm">{act.icon}</span>
                                )}
                                <span>{act.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Feedback Control Bar */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant text-xs border-t border-surface-container-high/40">
                          <span className="text-[11px]">Apakah informasi ini membantu?</span>
                          <div className="flex items-center gap-2">
                            <button
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                feedbackGiven[msg.id] === 'up'
                                  ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                                  : 'hover:bg-surface-container text-on-surface'
                              }`}
                              onClick={() => handleFeedback(msg.id, 'up')}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm text-primary">
                                thumb_up
                              </span>
                              <span>Membantu</span>
                            </button>
                            <button
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                feedbackGiven[msg.id] === 'down'
                                  ? 'bg-error-container text-on-error-container font-bold'
                                  : 'hover:bg-surface-container text-on-surface'
                              }`}
                              onClick={() => handleFeedback(msg.id, 'down')}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-sm text-error">
                                thumb_down
                              </span>
                              <span>Kurang Jelas</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] text-on-surface-variant px-1 block">
                        {msg.timestamp}{' '}
                        {msg.inferenceTime && `• Waktu Inferensi: ${msg.inferenceTime}`} • RAG Terverifikasi
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Typing Animation State */}
              {isTyping && (
                <div className="flex items-start gap-3 max-w-3xl animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <span className="material-symbols-outlined text-base">smart_toy</span>
                  </div>
                  <div className="bg-surface-container-lowest p-3.5 rounded-2xl rounded-tl-none shadow-xs border border-surface-container-high/50 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    ></span>
                    <span className="text-xs text-on-surface-variant ml-2 font-medium">
                      Mencari arsip SOP pekon &amp; menyusun jawaban...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Composer Tray */}
            <div className="p-4 sm:p-5 bg-surface-container-lowest border-t border-surface-container-high/60 space-y-3">
              {/* Quick Suggestion Action Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-on-surface-variant no-scrollbar">
                <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-sm text-primary">recommend</span>
                  Saran:
                </span>
                {[
                  'Berapa lama masa berlaku Surat Keterangan Usaha (SKU)?',
                  'Apakah bisa diwakilkan oleh anggota keluarga dalam satu KK?',
                  'Dimana alamat balai pekon Margodadi dan jam operasionalnya?',
                ].map((sug, sidx) => (
                  <button
                    key={sidx}
                    className="shrink-0 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-xs transition-colors cursor-pointer border border-surface-container-high/30"
                    onClick={() => handleSend(sug)}
                    type="button"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              {/* Input Bar Form */}
              <form
                className="flex items-end gap-2 bg-surface-container-low rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/20 border border-surface-container-high/40 transition-all"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
              >
                {/* Attachment Button */}
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
                  onClick={simulateUpload}
                  title="Lampirkan Dokumen / KTP"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">attach_file</span>
                </button>

                {/* Textarea Field */}
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent border-0 resize-none text-xs sm:text-sm text-on-surface focus:outline-none placeholder:text-on-surface-variant/60 py-2 max-h-32 leading-relaxed"
                    placeholder="Ketik pertanyaan Anda di sini... (tekan Enter untuk mengirim)"
                    rows={1}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                </div>

                {/* Voice Input Trigger */}
                <button
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    isVoiceActive
                      ? 'bg-error text-on-error animate-pulse'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                  onClick={toggleVoiceInput}
                  title={isVoiceActive ? 'Mendengarkan...' : 'Gunakan Suara'}
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">mic</span>
                </button>

                {/* Submit Button */}
                <button
                  className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
                  disabled={!inputText.trim()}
                  type="submit"
                >
                  <span className="hidden sm:inline">Kirim</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </form>

              {/* Security & Protocol Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">lock</span>
                  <span>Seluruh percakapan dienkripsi sesuai Kebijakan Privasi Desa.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Model RAG Llama-3-Margodadi</span>
                  <span>•</span>
                  <span>Operator Aktif: 2 Petugas</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 4. MICRO NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 pointer-events-none">
          <div className="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium pointer-events-auto">
            <span className="material-symbols-outlined text-base text-primary-fixed">info</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
