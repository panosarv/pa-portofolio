import { useRef } from 'react'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export const Experience = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.2)

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-30px)',
    config: { tension: 120, friction: 20 },
  })

  const contentSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
    config: { tension: 120, friction: 20 },
    delay: 200,
  })

  const skills = [
    { title: 'Development', items: ['Apex', 'LWC', 'Aura'] },
    { title: 'Automation', items: ['Flows', 'Triggers', 'Validation Rules'] },
    { title: 'Tools', items: ['Git', 'Bitbucket', 'YAML'] },
    { title: 'Platform', items: ['Communities', 'Metadata', 'Pipelines'] },
  ]

  const trail = useTrail(skills.length, {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 120, friction: 20 },
    delay: 400,
  })

  return (
    <section id="experience" ref={ref} className="min-h-screen py-20 sm:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <animated.h2 style={titleSpring} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-12 sm:mb-20">
          EXPERIENCE
        </animated.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Timeline line */}
          <div className="hidden md:block md:col-span-1">
            <div className="w-px h-full bg-gray-300 ml-4" />
          </div>

          {/* Content */}
          <div className="md:col-span-11 space-y-8 sm:space-y-16">
            <animated.div style={contentSpring} className="relative">
              {/* Timeline dot */}
              <div className="hidden md:block absolute -left-20 top-2 w-3 h-3 bg-black rounded-full" />

              <div className="border-l-4 border-black pl-6 sm:pl-8 md:pl-0 md:border-l-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">Salesforce Consultant</h3>
                    <p className="text-lg sm:text-xl text-gray-600">Deloitte</p>
                  </div>
                  <div className="text-base sm:text-lg font-mono text-gray-500 mt-2 md:mt-0">
                    3 Years
                  </div>
                </div>

                <div className="space-y-4 text-base sm:text-lg">
                  <p className="font-light leading-relaxed">
                    Specialized in Salesforce CRM implementations and customizations, working on
                    enterprise-level projects including the UnoEnergy CRM system.
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
                    {trail.map((style, index) => (
                      <animated.div key={index} style={style} className="space-y-2">
                        <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wide">
                          {skills[index].title}
                        </h4>
                        <ul className="text-xs sm:text-sm space-y-1 text-gray-600">
                          {skills[index].items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </animated.div>
                    ))}
                  </div>
                </div>
              </div>
            </animated.div>
          </div>
        </div>
      </div>
    </section>
  )
}
