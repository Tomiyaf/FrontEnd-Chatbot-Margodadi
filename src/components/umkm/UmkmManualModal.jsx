import React from 'react'

export default function UmkmManualModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-container-high space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">how_to_reg</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface">
              Persyaratan Registrasi UMKM Pekon
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-on-surface">
          <p className="text-on-surface-variant text-xs">
            Pelaku usaha warga Pekon Margodadi dapat membawa berkas-berkas berikut ke Loket Kasi Kesejahteraan / Pelayanan di Balai Pekon:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
              <span>Fotokopi KTP &amp; KK Pekon Margodadi (Pemilik Usaha)</span>
            </li>
            <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
              <span>Surat Keterangan Usaha (SKU) dari RT/Pekon Margodadi</span>
            </li>
            <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
              <span>Foto produk fisik &amp; dokumentasi tempat produksi usaha</span>
            </li>
            <li className="flex items-start gap-2 bg-surface-container-low p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
              <span>Nomor kontak WhatsApp aktif untuk narahubung katalog online</span>
            </li>
          </ul>
        </div>

        <div className="pt-2 border-t border-surface-container-high/60 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer shadow-xs"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
