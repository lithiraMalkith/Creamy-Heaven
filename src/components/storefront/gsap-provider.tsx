'use client'

import { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function GsapProvider({ children }: { children: ReactNode }) {
  // Global smooth scroll or specific GSAP setup can go here
  return <>{children}</>
}
