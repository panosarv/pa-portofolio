import { useState } from 'react'

const navLinks = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PORTFOLIO', href: '#portfolio' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CERTIFICATIONS', href: '#certifications' },
  { name: 'CONTACT', href: '#contact' },
]

interface NavbarProps {
  hidden?: boolean
}

export const Navbar = ({ hidden = false }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element && window.lenis) {
      window.lenis.scrollTo(element as HTMLElement, {
        offset: -100, // Account for navbar height
        duration: 1.2,
      })
    } else if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-double border-black shadow-sm transition-transform duration-300 ${
      hidden ? '-translate-y-full' : 'translate-y-0'
    }`}>
      {/* Top metadata bar - editorial style */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between text-xs">
          <span className="font-mono tracking-wider text-gray-600">{currentDate}</span>
          <span className="hidden sm:block font-light tracking-widest uppercase text-gray-500">
            Full-Stack Developer · AI Enthusiast
          </span>
          <span className="font-mono tracking-wider text-gray-600">Greece</span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4 md:py-6">
          {/* Logo - Magazine masthead style */}
          <button
            onClick={() => window.lenis?.scrollTo(0)}
            className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter hover:opacity-70 transition-opacity"
          >
            PANAGIOTIS ARVANITIS
          </button>

          {/* Desktop Navigation with dividers */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((link, index) => (
              <div key={link.name} className="flex items-center">
                <button
                  onClick={() => scrollToSection(link.href)}
                  className="text-[10px] tracking-[0.2em] uppercase font-light hover:opacity-50 transition-opacity px-3"
                >
                  {link.name}
                </button>
                {index < navLinks.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 w-6 h-6 justify-center"
            aria-label="Toggle menu"
          >
            <span
              className={`w-full h-0.5 bg-black transition-transform origin-center ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-full h-0.5 bg-black transition-opacity ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-full h-0.5 bg-black transition-transform origin-center ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-gray-200 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-1 bg-white">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-xs tracking-[0.2em] uppercase font-light py-3 hover:opacity-50 transition-opacity border-b border-gray-100 last:border-0"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
