import { useEffect, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

interface LoaderProps {
  onComplete: () => void
}

export const Loader = ({ onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0)

  // Logo fade in
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 600 },
  })

  // Final fade out
  const fadeOut = useSpring({
    opacity: progress >= 100 ? 0 : 1,
    config: { duration: 500 },
    onRest: () => {
      if (progress >= 100) {
        onComplete()
      }
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 25)

    return () => clearInterval(interval)
  }, [])

  // Calculate fill height (fills from bottom to top, so invert)
  const fillHeight = progress

  return (
    <animated.div
      style={fadeOut}
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden"
    >
      <animated.div style={fadeIn} className="relative inline-block">
        {/* Outlined PA (background) */}
        <h1
          className="text-[10rem] sm:text-[15rem] md:text-[20rem] font-black tracking-tighter select-none whitespace-nowrap"
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)',
            lineHeight: '1.2',
            display: 'block',
          }}
        >
          PA
        </h1>

        {/* Filled PA (liquid fill) */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: '-10%',
            left: '-10%',
            right: '-10%',
            bottom: '-10%',
            clipPath: `inset(${100 - fillHeight}% 0 0 0)`,
          }}
        >
          <h1
            className="text-[10rem] sm:text-[15rem] md:text-[20rem] font-black text-white tracking-tighter select-none whitespace-nowrap"
            style={{
              lineHeight: '1.2',
              display: 'block',
              position: 'relative',
              top: '11.11%',
              left: '11.11%',
            }}
          >
            PA
          </h1>

          {/* Wave effect at the fill line */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
            style={{
              top: `${100 - fillHeight}%`,
              filter: 'blur(2px)',
              animation: 'wave 2s ease-in-out infinite',
            }}
          />
        </div>
      </animated.div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.05); }
        }
      `}</style>
    </animated.div>
  )
}
