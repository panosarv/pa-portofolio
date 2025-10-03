import { useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export const About = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.2)

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0px)' : 'translateX(-50px)',
    config: { tension: 120, friction: 20 },
  })

  const contentSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0px)' : 'translateX(50px)',
    config: { tension: 120, friction: 20 },
    delay: 200,
  })

  return (
    <section ref={ref} className="min-h-screen py-20 sm:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <animated.div style={titleSpring}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 leading-tight">
              CRAFTING
              <br />
              DIGITAL
              <br />
              EXPERIENCES
            </h2>
          </animated.div>

          <animated.div style={contentSpring} className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed">
            <p className="font-light">
              Full-stack developer with a passion for creating seamless digital experiences
              that blend functionality with aesthetic appeal. Specializing in modern web
              technologies and AI-powered solutions.
            </p>

            <p className="font-light">
              With 3 years of experience as a Salesforce Consultant at Deloitte, I've honed
              my skills in enterprise-level solutions, CRM implementations, and cloud-based
              development. My expertise spans from frontend frameworks like Vue and React to
              backend systems using Python, FastAPI, and PostgreSQL.
            </p>

            <p className="font-light">
              I believe in the intersection of design and technology, where every line of code
              contributes to a meaningful user experience.
            </p>
          </animated.div>
        </div>
      </div>
    </section>
  )
}
