import React from 'react'

export default function UmkmFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
}) {
  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'kuliner': return 'restaurant'
      case 'kerajinan': return 'palette'
      case 'pertanian': return 'agriculture'
      case 'jasa': return 'handyman'
      default: return 'apps'
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high/60 shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama UMKM, produk unggulan, pemilik..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container-high rounded-xl text-xs sm:text-sm text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Category Filter Pills & Sort Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{getCategoryIcon(cat.id)}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 bg-surface-container-lowest border border-surface-container-high rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="popular">Terpopuler</option>
          <option value="az">Nama (A - Z)</option>
          <option value="newest">Terbaru</option>
        </select>
      </div>
    </div>
  )
}
