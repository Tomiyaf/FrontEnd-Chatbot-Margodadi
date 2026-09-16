import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity Info */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-base font-semibold text-white">
                Virtual Guide Pekon Margodadi
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sistem Informasi dan Asisten Virtual Pelayanan Masyarakat Pekon Margodadi.
              Memberikan kemudahan akses informasi publik dan panduan layanan pekon.
            </p>
          </div>

          {/* Quick Links Placeholder */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Tautan Cepat (Placeholder)
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Panduan Layanan Publik
                </span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  Informasi Administrasi Pekon
                </span>
              </li>
              <li>
                <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Akses Back-Office (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Office Placeholder */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Kontak & Alamat (Placeholder)
            </h3>
            <div className="text-xs text-gray-400 space-y-1.5">
              <p>Kantor Pekon Margodadi</p>
              <p>Kecamatan Ambarawa, Kabupaten Pringsewu, Lampung</p>
              <p className="pt-2 text-emerald-400">Email: info@margodadi.desa.id</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pekon Margodadi. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Front-Office Layer Placeholder</p>
        </div>
      </div>
    </footer>
  )
}
