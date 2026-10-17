import React from 'react'

export default function UmkmPreviewModal({ isOpen, onClose, umkm }) {
  if (!isOpen || !umkm) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                {umkm.category?.name || 'UMKM Pekon'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                No. Reg: {umkm.reg_number}
              </span>
              {umkm.is_ai_synced ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  <span className="material-symbols-outlined text-sm">smart_toy</span>
                  <span>Terindeks di AI</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200">
                  <span className="material-symbols-outlined text-sm">pending</span>
                  <span>Belum Terindeks AI</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {umkm.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{umkm.sub_title}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Banner Image */}
          {umkm.banner_image_url ? (
            <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={umkm.banner_image_url}
                alt={umkm.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-32 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
              Belum ada foto banner utama
            </div>
          )}

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Pemilik Usaha:</span>
              <strong className="text-slate-800 font-semibold">{umkm.owner_name}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kontak WhatsApp:</span>
              {umkm.wa_number ? (
                <a
                  href={`https://wa.me/${umkm.wa_number}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">chat</span>
                  <span>+{umkm.wa_number}</span>
                </a>
              ) : (
                <span className="text-slate-500">-</span>
              )}
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Alamat &amp; Dusun:</span>
              <span className="text-slate-700">{umkm.address || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Legalitas &amp; Izin:</span>
              <span className="text-slate-700">{umkm.legal_certification || 'SKU Pekon'} ({umkm.legal_number || '-'})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kapasitas Produksi:</span>
              <span className="text-slate-700">{umkm.production_capacity || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kelompok Tani / Binaan:</span>
              <span className="text-slate-700">{umkm.group_name || '-'} ({umkm.group_location || '-'})</span>
            </div>
          </div>

          {/* Description */}
          {umkm.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Profil &amp; Deskripsi Usaha
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {umkm.description}
              </p>
            </div>
          )}

          {/* History */}
          {umkm.history && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Sejarah Rintisan Usaha
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {umkm.history}
              </p>
            </div>
          )}

          {/* Products List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Daftar Produk Unggulan ({umkm.products?.length || 0})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {umkm.products && umkm.products.length > 0 ? (
                umkm.products.map((prod, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between gap-2 shadow-2xs"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{prod.name}</div>
                      {prod.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{prod.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-primary shrink-0 bg-primary/10 px-2 py-0.5 rounded-lg">
                      {isNumeric(prod.price)
                        ? `Rp ${Number(prod.price).toLocaleString('id-ID')}`
                        : prod.price || 'Sesuai pesanan'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Belum ada produk yang didaftarkan.</p>
              )}
            </div>
          </div>

          {/* Gallery Photos */}
          {umkm.gallery_urls && umkm.gallery_urls.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Galeri Foto Produk &amp; Workshop
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {umkm.gallery_urls.map((url, idx) => (
                  <div
                    key={idx}
                    className="h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs"
                  >
                    <img src={url} alt={`Galeri ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  )
}

function isNumeric(str) {
  if (typeof str !== 'string' && typeof str !== 'number') return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}
