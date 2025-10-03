import { useState, useRef, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { BlueprintCanvas } from './BlueprintCanvas'

interface ProjectsProps {
  onBlueprintChange?: (open: boolean) => void
}

export const Projects = ({ onBlueprintChange }: ProjectsProps) => {
  const [showBlueprint, setShowBlueprint] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.2)

  useEffect(() => {
    onBlueprintChange?.(showBlueprint)
  }, [showBlueprint, onBlueprintChange])

  const spring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 20 },
  })

  return (
    <>
      <section id="projects" ref={ref} className="min-h-screen py-20 sm:py-32 px-4 md:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <animated.div style={spring} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              SELECTED
              <br />
              WORKS
            </h2>

            <p className="text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-12 max-w-2xl opacity-70 px-4">
              A collection of web applications and systems built with modern technologies,
              from booking platforms to AI-powered decision systems.
            </p>

            <button
              onClick={() => setShowBlueprint(true)}
              className="group relative px-8 sm:px-12 py-4 sm:py-6 border-2 border-white overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 text-sm sm:text-base md:text-lg tracking-widest uppercase font-semibold">
                Explore Projects
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity text-sm sm:text-base md:text-lg tracking-widest uppercase font-semibold">
                Explore Projects
              </span>
            </button>

            <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-mono opacity-50">
              Interactive Blueprint View
            </p>
          </animated.div>
        </div>
      </section>

      {showBlueprint && <BlueprintCanvas onClose={() => setShowBlueprint(false)} />}
    </>
  )
}
