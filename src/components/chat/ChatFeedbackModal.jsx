import React, { useState } from 'react'

export default function ChatFeedbackModal({ isOpen, onClose, onSubmitFeedback, sessionId }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (onSubmitFeedback) {
        await onSubmitFeedback({ rating, comment, session_id: sessionId })
      }
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Feedback submit failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">star</span>
            </span>
            <h2 className="text-base font-bold text-slate-900">Ulasan Virtual Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
            <p className="text-sm font-bold text-slate-800">Terima kasih atas ulasan Anda!</p>
            <p className="text-xs text-slate-500">Masukan Anda membantu meningkatkan kualitas pelayanan warga.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stars Selector */}
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-slate-600 block">Seberapa puas Anda dengan jawaban AI?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl ${
                        star <= rating ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600">
                {rating === 5 ? 'Sangat Memuaskan' : rating === 4 ? 'Memuaskan' : rating === 3 ? 'Cukup' : 'Kurang'}
              </span>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Komentar atau Saran Perbaikan (Opsional):
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tuliskan pengalaman Anda atau informasi apa yang belum terjawab..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
