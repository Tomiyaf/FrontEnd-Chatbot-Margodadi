import React, { useState, useEffect } from 'react'

const BADGE_PRESETS = [
  'SURAT_PENGANTAR',
  'ADMINISTRASI',
  'FASILITAS',
  'SOP_LOKET',
  'PERIZINAN',
]

const SUB_BADGE_PRESETS = [
  'Kependudukan',
  'UMKM & Perbankan',
  'Sosial & Pendidikan',
  'Sarana Publik Warga',
  'Badan Hukum / Lembaga',
]

export default function PublicServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingService,
  categories = [],
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category_id: '',
    category_badge: 'SURAT_PENGANTAR',
    sub_category_badge: '',
    description: '',
    legal_basis: '',
    requirements: [''],
    sla_duration: '1 Hari Kerja',
    cost_info: 'Gratis (Rp 0)',
    officer_in_charge: 'Loket Pelayanan Pekon',
    download_url: '',
    tagsInput: '',
    is_active: true,
  })

  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title || '',
        slug: editingService.slug || '',
        category_id: editingService.category_id || (categories[0]?.category_id ?? ''),
        category_badge: editingService.category_badge || 'SURAT_PENGANTAR',
        sub_category_badge: editingService.sub_category_badge || '',
        description: editingService.description || '',
        legal_basis: editingService.legal_basis || '',
        requirements:
          Array.isArray(editingService.requirements) && editingService.requirements.length > 0
            ? editingService.requirements
            : [''],
        sla_duration: editingService.sla_duration || '1 Hari Kerja',
        cost_info: editingService.cost_info || 'Gratis (Rp 0)',
        officer_in_charge: editingService.officer_in_charge || 'Loket Pelayanan Pekon',
        download_url: editingService.download_url || '',
        tagsInput: Array.isArray(editingService.tags) ? editingService.tags.join(', ') : '',
        is_active: editingService.is_active ?? true,
      })
    } else {
      setFormData({
        title: '',
        slug: '',
        category_id: categories[0]?.category_id ?? '',
        category_badge: 'SURAT_PENGANTAR',
        sub_category_badge: '',
        description: '',
        legal_basis: '',
        requirements: [''],
        sla_duration: '1 Hari Kerja',
        cost_info: 'Gratis (Rp 0)',
        officer_in_charge: 'Loket Pelayanan Pekon',
        download_url: '',
        tagsInput: '',
        is_active: true,
      })
    }
  }, [editingService, categories, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Requirements list handlers
  const handleRequirementChange = (index, val) => {
    setFormData((prev) => {
      const next = [...prev.requirements]
      next[index] = val
      return { ...prev, requirements: next }
    })
  }

  const handleAddRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }))
  }

  const handleRemoveRequirement = (index) => {
    setFormData((prev) => {
      const next = prev.requirements.filter((_, idx) => idx !== index)
      return { ...prev, requirements: next.length > 0 ? next : [''] }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Clean requirements
    const cleanedRequirements = formData.requirements
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    // Clean tags
    const tags = formData.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0)

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      category_id: Number(formData.category_id),
      category_badge: formData.category_badge.trim() || undefined,
      sub_category_badge: formData.sub_category_badge.trim() || undefined,
      description: formData.description.trim(),
      legal_basis: formData.legal_basis.trim() || undefined,
      requirements: cleanedRequirements,
      sla_duration: formData.sla_duration.trim() || undefined,
      cost_info: formData.cost_info.trim() || undefined,
      officer_in_charge: formData.officer_in_charge.trim() || undefined,
      download_url: formData.download_url.trim() || undefined,
      tags: tags,
      is_active: formData.is_active,
    }

    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header (Fixed) */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">
                {editingService ? 'edit_document' : 'post_add'}
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? 'Edit Layanan Publik' : 'Tambah Layanan Publik Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                Layanan ini akan langsung tampil di portal direktori warga Pekon Margodadi
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Baris 1: Judul Layanan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama / Judul Layanan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Surat Keterangan Usaha (SKU), Surat Keterangan Domisili"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Baris 2: Kategori & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Layanan <span className="text-rose-500">*</span>
              </label>
              <select
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="" disabled>
                  -- Pilih Kategori --
                </option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Slug (URL Identifier)
                <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="contoh: sku, surat-pengantar-ktp"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Baris 3: Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category Badge (Label Utama)
              </label>
              <input
                type="text"
                name="category_badge"
                value={formData.category_badge}
                onChange={handleChange}
                placeholder="SURAT_PENGANTAR, ADMINISTRASI..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {BADGE_PRESETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category_badge: b }))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sub-Category Badge (Label Sekunder)
              </label>
              <input
                type="text"
                name="sub_category_badge"
                value={formData.sub_category_badge}
                onChange={handleChange}
                placeholder="Contoh: Kependudukan, UMKM & Perbankan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUB_BADGE_PRESETS.map((sb) => (
                  <button
                    key={sb}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, sub_category_badge: sb }))}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                  >
                    {sb}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Baris 4: Deskripsi & Dasar Hukum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Prosedur Layanan <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan tujuan layanan dan peruntukan surat atau izin ini bagi warga..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dasar Hukum &amp; Regulasi
            </label>
            <input
              type="text"
              name="legal_basis"
              value={formData.legal_basis}
              onChange={handleChange}
              placeholder="Contoh: Peraturan Pekon Margodadi No. 04 Tahun 2023 / UU Adminduk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Baris 5: Berkas Persyaratan Pemohon (Interactive List) */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">checklist</span>
                  Berkas Persyaratan Pemohon
                </h4>
                <p className="text-[11px] text-slate-500">
                  Daftar dokumen fisik/berkas yang wajib dibawa oleh pemohon ke loket
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Tambah Syarat</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono w-5 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(idx, e.target.value)}
                    placeholder="Contoh: Fotokopi e-KTP Pemohon yang masih berlaku (1 lembar)"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus butir persyaratan ini"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Baris 6: SLA Duration, Cost, Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Estimasi Durasi (SLA)
              </label>
              <input
                type="text"
                name="sla_duration"
                value={formData.sla_duration}
                onChange={handleChange}
                placeholder="1 Hari Kerja / Langsung Jadi"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Biaya Retribusi
              </label>
              <input
                type="text"
                name="cost_info"
                value={formData.cost_info}
                onChange={handleChange}
                placeholder="Gratis (Rp 0)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Petugas Loket
              </label>
              <input
                type="text"
                name="officer_in_charge"
                value={formData.officer_in_charge}
                onChange={handleChange}
                placeholder="Loket Kasi Pelayanan"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Baris 7: Download URL & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tautan Unduh Formulir / Blangko (URL PDF)
              </label>
              <input
                type="url"
                name="download_url"
                value={formData.download_url}
                onChange={handleChange}
                placeholder="https://margodadi.desa.id/downloads/blangko.pdf"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tags Pencarian (Pisahkan koma)
              </label>
              <input
                type="text"
                name="tagsInput"
                value={formData.tagsInput}
                onChange={handleChange}
                placeholder="ktp, domisili, surat, pindah, kk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
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
                Publikasikan layanan ini secara aktif di portal publik
              </span>
            </label>
          </div>

          {/* Actions (Fixed at bottom) */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 shrink-0">
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
                  <span>{editingService ? 'Simpan Perubahan' : 'Buat Layanan Publik'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
