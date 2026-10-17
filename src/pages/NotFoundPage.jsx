import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-6xl font-extrabold text-emerald-600">404</h1>
        <h2 className="text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">
          Halaman yang Anda tuju tidak ditemukan atau sedang dalam tahap pengembangan.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
