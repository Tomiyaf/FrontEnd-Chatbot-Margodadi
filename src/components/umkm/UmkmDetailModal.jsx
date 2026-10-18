import React from 'react'
import { Link } from 'react-router-dom'
import LazyImage from '../common/LazyImage'

export default function UmkmDetailModal({
  isOpen,
  onClose,
  umkm,
  onToast,
}) {
  if (!isOpen || !umkm) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-surface-container-high overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Sticky) */}
        <div className="p-5 sm:p-6 pb-4 border-b border-surface-container-high/60 flex items-start justify-between gap-4 bg-surface-container-lowest/95 backdrop-blur-md shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Profil Usaha Warga Pekon
              </span>
              {umkm.categoryBadge && (
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-xs font-semibold">
                  {umkm.categoryBadge}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-primary font-bold truncate">
              {umkm.name}
            </h2>
            {umkm.subTitle && (
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 line-clamp-1">
                {umkm.subTitle}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            type="button"
            aria-label="Tutup Profil"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 md:p-8 space-y-6">
          {/* Main Banner Photo */}
          {umkm.image && (
            <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-surface-container border border-surface-container-high/40 shadow-xs">
              <LazyImage
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                src={umkm.image}
                alt={umkm.name}
              />
            </div>
          )}

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">storefront</span>
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-on-surface">
                  {umkm.owner}
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-secondary">call</span>
                  <span>{umkm.phone}</span>
                  {umkm.address && (
                    <>
                      <span className="text-outline-variant">•</span>
                      <span>{umkm.address}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {umkm.waNumber && (
                <a
                  className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-on-secondary-container transition-all shadow-xs flex-1 sm:flex-none"
                  href={`https://wa.me/${umkm.waNumber}?text=Halo%20${encodeURIComponent(
                    umkm.owner
                  )},%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(
                    umkm.name
                  )}%20di%20Virtual%20Guide%20Pekon%20Margodadi`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  <span>Hubungi WhatsApp</span>
                </a>
              )}
              <Link
                to={`/tanya-virtual-guide?umkm=${encodeURIComponent(umkm.name)}`}
                className="inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary transition-all shadow-xs flex-1 sm:flex-none"
                onClick={onClose}
              >
                <span className="material-symbols-outlined text-base">smart_toy</span>
                <span>Tanya AI</span>
              </Link>
            </div>
          </div>

          {/* Business Description */}
          {umkm.description && (
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                Deskripsi Usaha
              </h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {umkm.description}
              </p>
            </div>
          )}

          {/* Gallery with LazyImage */}
          {umkm.gallery && umkm.gallery.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-sm sm:text-base text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">photo_library</span>
                Dokumentasi Usaha &amp; Galeri
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {umkm.gallery.map((imgUrl, gidx) => (
                  <div
                    key={gidx}
                    className="h-28 sm:h-36 rounded-xl overflow-hidden bg-surface-container group/img cursor-pointer border border-surface-container-high/40"
                    onClick={() =>
                      onToast && onToast(`Foto dokumentasi ${gidx + 1} ${umkm.name} diperbesar.`)
                    }
                  >
                    <LazyImage
                      className="w-full h-full group-hover/img:scale-110 transition-transform duration-300"
                      src={imgUrl}
                      alt={`${umkm.name} Dokumentasi ${gidx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Sticky) */}
        <div className="p-4 sm:p-5 border-t border-surface-container-high/60 bg-surface-container-lowest flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            type="button"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
