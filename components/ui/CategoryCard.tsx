"use client"

import Link from "next/link"
import Image from "next/image"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

interface CategoryCardProps {
  title: string
  slug: string
  imageSrc?: string
  score?: number
  progress?: number // 0-100
  description?: string
  completed?: number
  total?: number
}

const HOVER_DELAY_MS = 2000
const COLLAPSE_FLOATING_MS = 260
const MIN_COLLAPSED_HEIGHT = 240

export default function CategoryCard({
  title,
  slug,
  imageSrc = "/placeholder.jpg",
  score = 2.5,
  progress = 30,
  description,
  completed = 0,
  total = 0,
}: CategoryCardProps) {
  const pct = Math.max(0, Math.min(100, progress ?? 0))
  const titleId = `card-${slug}-title`

  const [isHovering, setIsHovering] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const [baseHeight, setBaseHeight] = useState<number | null>(null)

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardRef = useRef<HTMLElement | null>(null)

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  const clearFloatingTimeout = useCallback(() => {
    if (floatingTimeoutRef.current) {
      clearTimeout(floatingTimeoutRef.current)
      floatingTimeoutRef.current = null
    }
  }, [])

  const handleHoverStart = useCallback(() => {
    setIsHovering(true)
    if (!hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowDescription(true)
        setIsFloating(true)
        hoverTimeoutRef.current = null
      }, HOVER_DELAY_MS)
    }
  }, [])

  const handleHoverEnd = useCallback(() => {
    setIsHovering(false)
    clearHoverTimeout()
    setShowDescription(false)
    clearFloatingTimeout()
    floatingTimeoutRef.current = setTimeout(() => {
      setIsFloating(false)
      floatingTimeoutRef.current = null
    }, COLLAPSE_FLOATING_MS)
  }, [clearHoverTimeout, clearFloatingTimeout])

  const handleFocusStart = handleHoverStart
  const handleFocusEnd = handleHoverEnd

  const measureCollapsedHeight = useCallback(() => {
    if (cardRef.current) {
      setBaseHeight(Math.max(cardRef.current.offsetHeight, MIN_COLLAPSED_HEIGHT))
    }
  }, [])

  useLayoutEffect(() => {
    if (!isFloating) {
      measureCollapsedHeight()
    }
  }, [isFloating, measureCollapsedHeight, score, pct, completed, total, description, title])

  useEffect(() => {
    return () => {
      clearHoverTimeout()
      clearFloatingTimeout()
    }
  }, [clearHoverTimeout, clearFloatingTimeout])

  const baseCardClasses = "relative w-full flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:outline-none transform overflow-hidden"
  const floatingClasses = isFloating
    ? "z-30 shadow-xl border-indigo-200 ring-2 ring-indigo-100"
    : isHovering
      ? "z-20 shadow-lg border-indigo-300"
      : ""

  const transformValue = isFloating
    ? "scale3d(1.12,1.06,1)"
    : isHovering
      ? "scale3d(1.03,1.02,1)"
      : "scale3d(1,1,1)"

  const floatingPositionClass = isFloating ? "absolute left-0 top-0 right-0" : ""

  const measuredHeight = baseHeight != null ? Math.max(baseHeight, MIN_COLLAPSED_HEIGHT) : MIN_COLLAPSED_HEIGHT
  const containerStyle = baseHeight != null ? { height: measuredHeight } : { minHeight: MIN_COLLAPSED_HEIGHT }

  return (
    <Link
      href={`/auto-evaluaciones/${slug}`}
      className="group block overflow-visible h-full"
      aria-label={`Comenzar auto evaluación de ${title}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onFocus={handleFocusStart}
      onBlur={handleFocusEnd}
    >
  <div className="relative rounded-2xl overflow-visible h-full" style={containerStyle}>
        <article
          ref={cardRef}
          aria-labelledby={titleId}
          role="article"
          className={`${baseCardClasses} ${floatingClasses} ${floatingPositionClass} ${isFloating ? 'rounded-2xl' : ''}`}
          style={{ transform: transformValue, minHeight: MIN_COLLAPSED_HEIGHT }}
        >
          <div className="flex items-start gap-4 p-4 bg-white">
            <div className="flex-shrink-0 w-24 h-24 bg-white rounded-md flex items-center justify-center overflow-hidden">
              <Image src={imageSrc} alt={title} width={96} height={96} className="object-contain" />
            </div>

            <div className="flex-1 flex items-center justify-end">
              <div className="text-right">
                <div className="text-sm text-gray-500">Promedio</div>
                <div className="text-2xl font-extrabold text-black">{(score ?? 0).toFixed(1)}</div>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-green-600' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">{completed} de {total}</div>
                {pct >= 100 ? (
                  <div className="flex items-center text-green-600" aria-label="Completado">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Completado</span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">{Math.round(pct)}%</div>
                )}
              </div>
            </div>

            <h3 id={titleId} className="text-base font-semibold text-gray-900 leading-tight">{title}</h3>
            {description && (
              <div
                className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ease-out overflow-hidden ${showDescription ? 'opacity-100 translate-y-0 max-h-40 pt-2' : 'opacity-0 -translate-y-1 max-h-0 pointer-events-none'}`}
                aria-hidden={!showDescription}
              >
                <p className="break-words">{description}</p>
              </div>
            )}
            <div className="mt-auto" />
          </div>
        </article>
      </div>
    </Link>
  )
}
