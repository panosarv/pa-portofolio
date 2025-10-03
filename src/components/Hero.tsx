import { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'

export const Hero = () => {
  const [fadeIn] = useSpring(() => ({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 120, friction: 14 },
  }))

  const [parallax, parallaxApi] = useSpring(() => ({
    titleY: 0,
    subtitleY: 0,
    imageOpacity: 1,
  }))

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const scrollProgress = Math.min(scrollY / window.innerHeight, 1)

      parallaxApi.start({
        titleY: scrollProgress * 300,
        subtitleY: scrollProgress * 200,
        imageOpacity: Math.max(1 - scrollProgress * 2, 0),
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxApi])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background Image - Fixed in center */}
      <animated.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: parallax.imageOpacity }}
      >
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full" />
      </animated.div>

      {/* Content with Parallax */}
      <animated.div
        className="relative z-10 text-center w-full max-w-6xl"
        style={fadeIn}
      >
        <animated.h1
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4 leading-tight"
          style={{
            transform: parallax.titleY.to(y => `translateY(${y}px)`)
          }}
        >
          PANAGIOTIS
          <br />
          ARVANTIIS
        </animated.h1>

        <animated.div
          className="space-y-2"
          style={{
            transform: parallax.subtitleY.to(y => `translateY(${y}px)`)
          }}
        >
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-widest uppercase">
            Full-Stack Developer
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide opacity-70">
            AI Enthusiast
          </p>
        </animated.div>
      </animated.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 sm:h-16 bg-current opacity-30" />
      </div>
    </section>
  )
}
