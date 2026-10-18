import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low pt-12 pb-8 text-on-surface-variant border-t border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                alt="Logo Pekon Margodadi"
                className="h-9 w-auto object-contain"
                src="/favicon.svg"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-primary tracking-tight">
                  PEKON MARGODADI
                </span>
                <span className="text-xs text-on-surface-variant">
                  Kec. Ambarawa, Kab. Pringsewu, Lampung
                </span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Portal pusat koordinasi transparansi administratif dan pemberdayaan ekonomi lokal desa berbasis asisten cerdas Virtual Guide.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                className="inline-flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-container px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                href="https://wa.me/6282177890112"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-base leading-none">support_agent</span>
                <span>WhatsApp Center Pekon</span>
              </a>
            </div>
          </div>

          {/* Col 2: Sekretariat & Jam Layanan */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-on-surface">Sekretariat &amp; Jam Layanan</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">
                  location_on
                </span>
                <span>
                  Margodadi, Kec. Ambarawa, Kabupaten Pringsewu, Lampung 35376
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">
                  schedule
                </span>
                <div>
                  <span>Senin - Jumat: 08.00 - 15.30 WIB</span>
                  <p className="text-[11px] text-on-surface-variant/80">Sabtu, Minggu &amp; Libur: Tutup</p>
                </div>
              </div>
              {/* <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-base mt-0.5 shrink-0">
                  emergency
                </span>
                <div>
                  <span className="font-semibold text-on-surface">Darurat Pekon (24 Jam):</span>
                  <p className="text-[11px]">+62 821-7789-0112 (Satgas Linmas)</p>
                </div>
              </div>*/}
            </div>
          </div>

          {/* Col 3: Peta Situs */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-on-surface">Peta Situs</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/layanan-publik" className="hover:text-primary transition-colors">
                  Administrasi &amp; Surat
                </Link>
              </li>
              <li>
                <Link to="/potensi-umkm" className="hover:text-primary transition-colors">
                  Katalog UMKM Warga
                </Link>
              </li>
              <li>
                <Link to="/tanya-virtual-guide" className="hover:text-primary transition-colors">
                  Panduan RAG Virtual
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Riset & Kolaborasi */}
          {/* <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-on-surface">Riset &amp; Kolaborasi</h4>
            <div className="p-4 rounded-xl bg-surface-container-lowest space-y-2 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] border border-surface-container-high/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">verified</span>
                <span className="text-xs font-semibold text-primary">Skripsi Digital Governance</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pengembangan Prototipe Sistem Virtual Guide Multikanal Terintegrasi Berbasis Retrieval-Augmented Generation (RAG) untuk Akselerasi Layanan Pekon Margodadi.
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant border-t border-surface-container-high/40">
                <span>Status: Implementasi Pilot</span>
                <span className="font-semibold text-secondary">Versi 1.0</span>
              </div>
            </div>
          </div>*/}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} Pemerintah Pekon Margodadi. Seluruh Hak Cipta Dilindungi.</p>
          <p className="text-[11px] text-on-surface-variant/80">
            Didukung oleh Infrastruktur Sistem Informasi Pekon &amp; Unit Penunjang Akademik Teknologi Informasi dan Komunikasi Universitas Lampung.
          </p>
        </div>
      </div>
    </footer>
  )
}
