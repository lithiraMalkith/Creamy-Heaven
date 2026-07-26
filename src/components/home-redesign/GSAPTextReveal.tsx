'use client'

import { ReactNode, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export type TextRevealVariant =
  | 'split-words'
  | 'clip-slide'
  | 'blur-reveal'
  | 'stagger-pills'
  | 'hero-title'
  | 'fade-slide'

interface GSAPTextRevealProps {
  children: ReactNode
  variant?: TextRevealVariant
  delay?: number
  duration?: number
  stagger?: number
  className?: string
  /** Active stage range [startStage, endStage] (e.g. [0.2, 0.8] for section 1 philosophy) */
  stageRange?: [number, number]
  /** Current continuous stageValue from scroll (0.0 to 3.0) */
  currentStageValue?: number
}

export function GSAPTextReveal({
  children,
  variant = 'clip-slide',
  delay = 0,
  duration = 1.1,
  stagger = 0.08,
  className = '',
  stageRange,
  currentStageValue,
}: GSAPTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const elements = container.children.length > 0 ? Array.from(container.children) : [container]

      // Set initial styles based on variant
      if (variant === 'hero-title') {
        gsap.set(elements, {
          y: 60,
          opacity: 0,
          scale: 0.96,
          filter: 'blur(10px)',
          transformOrigin: 'center center',
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power4.out' },
        })

        tl.to(elements, {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          stagger: 0.15,
          delay: delay + 0.1,
        })

        timelineRef.current = tl
      } else if (variant === 'clip-slide') {
        gsap.set(elements, {
          y: '100%',
          opacity: 0,
          rotateX: 12,
          transformOrigin: 'left top',
        })

        if (!stageRange) {
          gsap.to(elements, {
            y: '0%',
            opacity: 1,
            rotateX: 0,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      } else if (variant === 'blur-reveal') {
        gsap.set(elements, {
          y: 35,
          opacity: 0,
          filter: 'blur(8px)',
        })

        if (!stageRange) {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      } else if (variant === 'stagger-pills') {
        gsap.set(elements, {
          y: 24,
          opacity: 0,
          scale: 0.9,
          filter: 'blur(4px)',
        })

        if (!stageRange) {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            delay,
            stagger: 0.1,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: container,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      } else if (variant === 'split-words' || variant === 'fade-slide') {
        gsap.set(elements, {
          y: 40,
          opacity: 0,
        })

        if (!stageRange) {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      }
    },
    { scope: containerRef, dependencies: [variant, delay, duration, stagger] }
  )

  // Reactive stageValue synchronization for model traversal sync
  useGSAP(
    () => {
      if (!containerRef.current || !stageRange || currentStageValue === undefined) return

      const [startStage, endStage] = stageRange
      const container = containerRef.current
      const elements = container.children.length > 0 ? Array.from(container.children) : [container]

      // Calculate progress between 0 and 1 within stageRange
      const rawProgress = (currentStageValue - startStage) / (endStage - startStage)
      const progress = Math.max(0, Math.min(1, rawProgress))

      // Eased progress for fluid sync with model lerp
      const easedProgress = gsap.parseEase('power2.out')(progress)

      if (variant === 'clip-slide' || variant === 'split-words') {
        gsap.to(elements, {
          y: `${(1 - easedProgress) * 50}px`,
          opacity: easedProgress,
          rotateX: (1 - easedProgress) * 10,
          filter: `blur(${(1 - easedProgress) * 6}px)`,
          duration: 0.25,
          stagger: 0.04,
          overwrite: 'auto',
        })
      } else if (variant === 'blur-reveal') {
        gsap.to(elements, {
          y: (1 - easedProgress) * 30,
          opacity: easedProgress,
          filter: `blur(${(1 - easedProgress) * 8}px)`,
          duration: 0.25,
          stagger: 0.04,
          overwrite: 'auto',
        })
      } else if (variant === 'stagger-pills') {
        gsap.to(elements, {
          y: (1 - easedProgress) * 20,
          opacity: easedProgress,
          scale: 0.9 + easedProgress * 0.1,
          filter: `blur(${(1 - easedProgress) * 4}px)`,
          duration: 0.25,
          stagger: 0.05,
          overwrite: 'auto',
        })
      }
    },
    { scope: containerRef, dependencies: [currentStageValue, stageRange, variant] }
  )

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </div>
  )
}
