import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

// Extend window interface to include lenis
declare global {
  interface Window {
    lenis?: Lenis
  }
}

// Global Lenis instance
let lenisInstance: Lenis | null = null

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisInstance = lenis
    // Expose to window for other components
    window.lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisInstance = null
      window.lenis = undefined
    }
  }, [])
}

// Hook to access Lenis scroll position
export const useLenisScroll = () => {
  const scrollRef = useRef(0)

  useEffect(() => {
    if (!lenisInstance) return

    const unsubscribe = lenisInstance.on('scroll', ({ scroll }: { scroll: number }) => {
      scrollRef.current = scroll
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return scrollRef.current
}
