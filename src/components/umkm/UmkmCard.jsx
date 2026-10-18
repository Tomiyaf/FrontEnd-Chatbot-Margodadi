import React from 'react'
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
        </div>

        {/* Card Action Button */}
        <div className="pt-2">
          <button
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer"
            onClick={() => onSelectProfile(item)}
            type="button"
          >
            <span>Lihat Profil Lengkap</span>
            <span className="material-symbols-outlined text-base">visibility</span>
          </button>
        </div>
      </div>
    </article>
  )
}
