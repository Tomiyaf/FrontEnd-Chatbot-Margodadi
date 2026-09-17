export default function CategoryBadge({ category = '', className = '' }) {
  const getCategoryTheme = () => {
    switch ((category || '').toLowerCase()) {
      case 'administrasi':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'edukasi sampah':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      case 'potensi umkm':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'informasi publik':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryTheme()} ${className}`}
    >
      {category || 'Umum'}
    </span>
  )
}
