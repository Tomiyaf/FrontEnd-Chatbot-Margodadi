import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import chatbotService from '../../services/chatbotService'
import ChatHeader from '../../components/chat/ChatHeader'
import ChatMessageFeed from '../../components/chat/ChatMessageFeed'
import ChatInputBar from '../../components/chat/ChatInputBar'

// Lazy load drawers & modals
const RagContextDrawer = lazy(() => import('../../components/chat/RagContextDrawer'))
const ChatFeedbackModal = lazy(() => import('../../components/chat/ChatFeedbackModal'))

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
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  // Drawer & Modal States
  const [isCitationDrawerOpen, setIsCitationDrawerOpen] = useState(false)
  const [activeSources, setActiveSources] = useState([])
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

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

  // Sync operator messages in real-time
  useEffect(() => {
    if (!conversationId) return

    const syncInterval = setInterval(async () => {
      try {
        const res = await chatbotService.syncMessages({ conversation_id: conversationId })
        if (res?.data?.messages && res.data.messages.length > 0) {
          const serverMessages = res.data.messages
          setMessages((prevMessages) => {
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

  // Scroll chat messages container on new message
  useEffect(() => {
    if (dialogueContainerRef.current) {
      dialogueContainerRef.current.scrollTo({
        top: dialogueContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isTyping])

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
        setMessages((prev) => [
          ...prev,
          {
            id: botReply.id || getNextId('bot'),
            sender: botReply.sender || 'bot',
            text: botReply.text || botReply.content,
            timestamp: botReply.timestamp || currentTime,
            sources: botReply.sources || [],
            chips: botReply.chips || [],
          },
        ])
      }
    } catch (err) {
      console.error('Send message failed:', err)
      setMessages((prev) => [
        ...prev,
        {
          id: getNextId('err'),
          sender: 'bot',
          text: 'Maaf, terjadi gangguan sementara saat menghubungkan ke sistem pekon. Silakan coba kembali sesaat lagi.',
          timestamp: currentTime,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetSession = () => {
    if (window.confirm('Mulai sesi percakapan baru dengan Virtual Guide?')) {
      const newSessionId = 'SESS-' + Math.random().toString(36).substring(2, 9).toUpperCase()
      localStorage.setItem('vg_public_session', newSessionId)
      setSessionId(newSessionId)
      setMessages(initialMessages)
      setFeedbackGiven({})
      showToast('Sesi percakapan baru telah dimulai.')
    }
  }

  const handleFeedback = (messageId, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [messageId]: type }))
    showToast(type === 'positive' ? 'Terima kasih atas ulasan positif Anda!' : 'Terima kasih atas masukan Anda.')
  }

  const handleViewCitation = (sources) => {
    setActiveSources(sources)
    setIsCitationDrawerOpen(true)
  }

  const handleToggleVoice = () => {
    setIsVoiceActive((prev) => !prev)
    if (!isVoiceActive) {
      showToast('Fitur suara aktif (Mendengarkan ucapan Anda)...')
    }
  }

  const handleSubmitFeedbackModal = async (feedbackData) => {
    await chatbotService.submitFeedback(feedbackData)
    showToast('Ulasan berhasil dikirim!')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-medium animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Chat Shell Container */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* 1. Header */}
        <ChatHeader
          anonymousCode={anonymousCode}
          sessionId={sessionId}
          onResetSession={handleResetSession}
          onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        />

        {/* 2. Message Feed */}
        <ChatMessageFeed
          ref={dialogueContainerRef}
          messages={messages}
          isTyping={isTyping}
          feedbackGiven={feedbackGiven}
          onFeedback={handleFeedback}
          onViewCitation={handleViewCitation}
          onChipClick={(chipPrompt) => handleSend(chipPrompt)}
        />

        {/* 3. Input Bar */}
        <ChatInputBar
          inputText={inputText}
          onInputChange={handleInputChange}
          onSend={handleSend}
          isTyping={isTyping}
          textareaRef={textareaRef}
          isVoiceActive={isVoiceActive}
          onToggleVoice={handleToggleVoice}
        />
      </div>

      {/* 4. On-Demand Lazy Drawers & Modals */}
      <Suspense fallback={null}>
        {isCitationDrawerOpen && (
          <RagContextDrawer
            isOpen={isCitationDrawerOpen}
            onClose={() => setIsCitationDrawerOpen(false)}
            sources={activeSources}
          />
        )}

        {isFeedbackModalOpen && (
          <ChatFeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={() => setIsFeedbackModalOpen(false)}
            onSubmitFeedback={handleSubmitFeedbackModal}
            sessionId={sessionId}
          />
        )}
      </Suspense>
    </div>
  )
}
