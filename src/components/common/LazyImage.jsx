import React, { useState, useEffect, useRef } from 'react'

export default function LazyImage({
  src,
  alt = '',
  className = '',
  placeholderClassName = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
  aspectRatio = '',
  threshold = 0.05,
  rootMargin = '150px',
  onClick,
  style,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    // If IntersectionObserver is not available, immediately display
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (containerRef.current) {
            observer.unobserve(containerRef.current)
          }
        }
      },
      { threshold, rootMargin }
    )

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  const imageSrc = isError ? fallbackSrc : (src || fallbackSrc)

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden bg-slate-100 ${aspectRatio} ${className}`}
      {...props}
    >
      {/* Shimmer Placeholder Skeleton */}
      {(!isLoaded || !isVisible) && (
        <div
          className={`absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse ${placeholderClassName}`}
          aria-hidden="true"
        >
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Actual Image Rendered Lazily */}
      {isVisible && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsError(true)
            setIsLoaded(true)
          }}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100 filter-none' : 'opacity-0 scale-105 blur-sm'
          }`}
        />
      )}
    </div>
  )
}
