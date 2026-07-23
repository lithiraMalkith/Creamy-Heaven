'use client'

import { ReactNode, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  stagger?: number
  duration?: number
  className?: string
  distance?: number
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  stagger = 0,
  duration = 0.8,
  className = '',
  distance = 40,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    let y = 0
    let x = 0

    if (direction === 'up') y = distance
    if (direction === 'down') y = -distance
    if (direction === 'left') x = distance
    if (direction === 'right') x = -distance

    const elements = containerRef.current.children

    gsap.fromTo(elements, {
      y,
      x,
      opacity: 0,
    }, {
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%', // Trigger when top of container is 85% down viewport
        toggleActions: 'play none none none',
      },
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
