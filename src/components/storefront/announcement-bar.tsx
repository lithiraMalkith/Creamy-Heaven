'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import type { AnnouncementItem } from '@/types'

interface AnnouncementBarProps {
  announcements?: AnnouncementItem[]
  enabled?: boolean
}

export function AnnouncementBar({ announcements, enabled = true }: AnnouncementBarProps) {
  const activeItems = announcements?.filter((a) => a.enabled) ?? []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!enabled || activeItems.length <= 1 || isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [enabled, activeItems.length, isPaused])

  if (!enabled || activeItems.length === 0) {
    return null
  }

  const currentItem = activeItems[currentIndex] || activeItems[0]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length)
  }

  return (
    <div
      className="bg-brand-black text-brand-cream border-b border-brand-white/10 text-xs sm:text-sm py-2 px-4 select-none relative z-50 transition-all overflow-hidden shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-max-width-content mx-auto flex items-center justify-between gap-3">
        {/* Left Arrow Controls (Desktop/Tablet)
        <button
          onClick={handlePrev}
          className="hidden sm:flex items-center justify-center text-brand-cream/60 hover:text-brand-cream transition-colors p-1 rounded hover:bg-white/10"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button> */}

        {/* Center Announcement Content */}
        <div className="flex-1 flex items-center justify-center text-center gap-2 overflow-hidden py-0.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0 hidden xs:inline" />
          <div className="transition-all duration-300 transform font-medium tracking-wide">
            {currentItem.link ? (
              <Link
                href={currentItem.link}
                className="hover:underline flex items-center gap-1.5 justify-center text-brand-white"
              >
                <span>{currentItem.text}</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  View
                </span>
              </Link>
            ) : (
              <span className="text-brand-cream">{currentItem.text}</span>
            )}
          </div>
        </div>


        <div className="flex items-center gap-1">
          {/* <button
            onClick={handleNext}
            className="hidden sm:flex items-center justify-center text-brand-cream/60 hover:text-brand-cream transition-colors p-1 rounded hover:bg-white/10"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button> */}

          {/* Dots Indicator */}
          {/* {activeItems.length > 1 && (
            <div className="flex items-center gap-1 ml-2">
              {activeItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-amber-300 w-3' : 'bg-brand-cream/40 hover:bg-brand-cream/70'
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
