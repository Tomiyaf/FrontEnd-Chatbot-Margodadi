import React from 'react'
import { Link } from 'react-router-dom'
import LazyImage from '../common/LazyImage'

export default function UmkmCard({ item, onSelectProfile }) {
  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-xs overflow-hidden hover:shadow-md transition-all border border-surface-container-high/60 group">
      {/* Image Header with Category Badge */}
      <div className="relative h-56 w-full overflow-hidden bg-surface-container">
        <LazyImage
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          src={item.image}
          alt={item.name}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-primary/90 backdrop-blur-md text-on-primary text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {item.categoryBadge}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>

          {/* Owner & Phone */}
          <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
            <span className="material-symbols-outlined text-sm text-primary">person</span>
            <span>{item.owner}</span>
            <span className="text-outline-variant">•</span>
            <span className="material-symbols-outlined text-sm text-secondary">call</span>
            <span>{item.phone}</span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-1.5 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm text-outline mt-0.5 shrink-0">
              location_on
            </span>
            <span className="line-clamp-1">{item.address}</span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-on-surface-variant line-clamp-2 pt-1 leading-relaxed">
            {item.description}
          </p>

          {/* Featured Products Pills */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider block mb-1.5">
              Produk Unggulan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.featuredProducts?.slice(0, 2).map((prod, pidx) => (
                <span
                  key={pidx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-xs text-on-surface"
                >
                  <span>{prod.name}</span>
                  <strong className="text-primary font-bold">{prod.price}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer"
            onClick={() => onSelectProfile(item)}
            type="button"
          >
            <span>Lihat Profil Lengkap</span>
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
          <Link
            to={`/tanya-virtual-guide?umkm=${encodeURIComponent(item.name)}`}
            className="w-full flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-primary py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>Tanya Stok ke Virtual Guide</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
