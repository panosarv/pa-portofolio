import { useRef } from 'react'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export const Certifications = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.2)

  const certifications = [
    'Salesforce Platform Developer 1',
    'Salesforce AI Specialist',
    'Salesforce AI Associate',
    'Salesforce Associate',
  ]

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-30px)',
    config: { tension: 120, friction: 20 },
  })

  const trail = useTrail(certifications.length, {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 120, friction: 20 },
    delay: 200,
  })

  return (
    <section ref={ref} className="min-h-screen py-20 sm:py-32 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <animated.h2 style={titleSpring} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-12 sm:mb-20">
          CERTIFICATIONS
        </animated.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {trail.map((style, index) => (
            <animated.div
              key={index}
              style={style}
              className="group relative bg-white p-6 sm:p-8 border-2 border-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer active:scale-95 transform"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
                {certifications[index]}
              </h3>
            </animated.div>
          ))}
        </div>
      </div>
    </section>
  )
}
