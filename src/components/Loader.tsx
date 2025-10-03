import { useEffect, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

interface LoaderProps {
  onComplete: () => void
}

export const Loader = ({ onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0)

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
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <animated.div
      style={fadeOut}
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
    >
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight">
          PA
        </h1>

        <div className="w-64 h-1 bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-white/50 text-sm font-mono mt-6">
          {progress}%
        </p>
      </div>
    </animated.div>
  )
}
