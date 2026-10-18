import React, { useState, useEffect } from 'react'

const ICON_PRESETS = [
  { icon: 'badge', label: 'Identitas / KTP' },
  { icon: 'description', label: 'Surat / Dokumen' },
  { icon: 'rule', label: 'SOP / Aturan' },
  { icon: 'meeting_room', label: 'Fasilitas / Ruangan' },
  { icon: 'apartment', label: 'Gedung / Sarpras' },
  { icon: 'storefront', label: 'Usaha / Bisnis' },
  { icon: 'groups', label: 'Sosial / Warga' },
  { icon: 'gavel', label: 'Hukum / Regulasi' },
  { icon: 'category', label: 'Umum' },
]

const normalizeIcon = (icon) => {
  const map = {
    'id-card': 'badge',
    'id_card': 'badge',
    users: 'groups',
    user: 'person',
    store: 'storefront',
  }
  return map[icon] || icon || 'description'
}

export default function CategoryFormModal({ isOpen, onClose, onSubmit, editingCategory, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'description',
    description: '',
    is_active: true,
  })

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        slug: editingCategory.slug || '',
        icon: editingCategory.icon || 'description',
        description: editingCategory.description || '',
        is_active: editingCategory.is_active ?? true,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        icon: 'description',
        description: '',
        is_active: true,
      })
    }
  }, [editingCategory, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {editingCategory ? 'edit_note' : 'add_circle'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Kategori Layanan' : 'Tambah Kategori Layanan Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Master kategori untuk pengelompokan layanan publik warga
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Nama Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Kategori <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Administrasi Kependudukan, Surat Pengantar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Slug Kategori (URL ID)
              <span className="text-slate-400 font-normal ml-1">
                (Otomatis digenerate jika dikosongkan)
              </span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="contoh: administrasi-kependudukan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ikon Kategori (Material Symbols)
            </label>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">{normalizeIcon(formData.icon)}</span>
              </div>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="badge, description, rule, apartment..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {ICON_PRESETS.map((p) => (
                <button
                  key={p.icon}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, icon: p.icon }))}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    formData.icon === p.icon
                      ? 'bg-primary/10 text-primary border border-primary/30 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Singkat Kategori
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat jenis-jenis layanan di bawah kategori ini..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Status Aktif */}
          <div className="pt-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 rounded text-primary bg-slate-50 border-slate-300 focus:ring-primary focus:ring-offset-white cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">
                Aktifkan kategori ini di direktori layanan publik
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>{editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
