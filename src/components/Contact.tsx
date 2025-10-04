import { useRef } from 'react'
import { useSpring, animated, useTrail } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export const Contact = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.2)

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-30px)',
    config: { tension: 120, friction: 20 },
  })

  const contactItems = [
    {
      label: 'Email',
      content: (
        <a
          href="mailto:pngarva@gmail.com"
          className="text-xl sm:text-2xl font-light hover:opacity-70 transition-opacity"
        >
          Get in touch
        </a>
      ),
    },
    {
      label: 'Social',
      content: (
        <div className="space-y-2">
          <a
            href="https://www.linkedin.com/in/pngarva/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg sm:text-xl font-light hover:opacity-70 transition-opacity"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/panosarv"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg sm:text-xl font-light hover:opacity-70 transition-opacity"
          >
            GitHub
          </a>
        </div>
      ),
    },
    {
      label: 'Location',
      content: <p className="text-xl sm:text-2xl font-light">Greece</p>,
    },
  ]

  const trail = useTrail(contactItems.length, {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 120, friction: 20 },
    delay: 300,
  })

  return (
    <footer id="contact" ref={ref} className="min-h-screen py-20 sm:py-32 px-4 md:px-8 bg-black text-white flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <animated.div style={titleSpring} className="mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
            LET'S
            <br />
            CONNECT
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-light opacity-70 max-w-2xl">
            Available for freelance projects, consultations, and collaborations.
          </p>
        </animated.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-20">
          {trail.map((style, index) => (
            <animated.div key={index} style={style}>
              <h3 className="text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 opacity-50">
                {contactItems[index].label}
              </h3>
              {contactItems[index].content}
            </animated.div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm opacity-50 text-center md:text-left">
            © 2025 Panagiotis Arvantiis. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm font-mono opacity-50 text-center md:text-right">
            Full-Stack Developer & AI Enthusiast
          </p>
        </div>
      </div>
    </footer>
  )
}
