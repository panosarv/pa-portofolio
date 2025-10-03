import React, { useEffect, useMemo, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import Lenis from 'lenis'

/* ----------------------- Data ----------------------- */

interface PortfolioItem {
  id: number
  title: string
  subtitle: string
  category: string
  images: string[]
  url: string
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Express Transfer Paros',
    subtitle: 'Premium Transfer Services',
    category: 'Web Development',
    images: [
      '/express-transfer-paros1.png',
      '/express-transfer-paros2.png',
      '/express-transfer-paros3.png',
    ],
    url: 'expresstransferparos.com',
  },
  {
    id: 2,
    title: 'The Cretan Pathfinders',
    subtitle: 'Safari Adventures in Crete',
    category: 'Web Development',
    images: [
      '/thecretanpathfinders1.png',
      '/thecretanpathfinders3.png',
      '/thecretanpathfinders4.png',
    ],
    url: 'thecretanpathfinders.gr',
  },
  {
    id: 3,
    title: 'Cretan Royal Transfer',
    subtitle: 'Luxury Transportation',
    category: 'Web Development',
    images: [
      '/cretanroraltransfer1.png',
      '/cretanroraltransfer2.png',
      '/cretanroraltransfer3.png',
    ],
    url: 'cretanroyaltransfer.gr',
  },
  {
    id: 4,
    title: 'AG Transfers',
    subtitle: 'Athens Transfer Solutions',
    category: 'Web Development',
    images: ['/agtransfers1.png', '/agtransfers2.png', '/agtransfers3.png'],
    url: 'agtransfers.gr',
  },
  {
    id: 5,
    title: 'MyServiceBook',
    subtitle: 'Vehicle Service Management',
    category: 'Full-Stack Application',
    images: ['/myservicebook1.png', '/myservicebook2.png'],
    url: 'myservicebook.gr',
  },
]

/* ----------------------- Layout helpers ----------------------- */

interface ImageLayout {
  width: string
  height: string
  top: string
  left?: string
  right?: string
  zIndex: number
}

const getImageLayout = (imageIndex: number, totalImages: number, itemId: number): ImageLayout => {
  const layouts: { [key: number]: ImageLayout[][] } = {
    // 2 images layouts
    2: [
      [
        { width: '65%', height: '65%', top: '5%', left: '2%', zIndex: 2 },
        { width: '55%', height: '55%', top: '45%', right: '3%', zIndex: 1 },
      ],
    ],
    // 3 images layouts - multiple variations
    3: [
      // Pattern 1 - diagonal cascade
      [
        { width: '60%', height: '60%', top: '3%', left: '1%', zIndex: 2 },
        { width: '48%', height: '50%', top: '20%', right: '3%', zIndex: 3 },
        { width: '55%', height: '55%', top: '60%', left: '18%', zIndex: 1 },
      ],
      // Pattern 2 - centered stack
      [
        { width: '58%', height: '58%', top: '5%', right: '2%', zIndex: 3 },
        { width: '52%', height: '52%', top: '25%', left: '3%', zIndex: 2 },
        { width: '60%', height: '58%', top: '62%', right: '15%', zIndex: 1 },
      ],
      // Pattern 3 - alternating sides
      [
        { width: '55%', height: '56%', top: '2%', left: '5%', zIndex: 2 },
        { width: '50%', height: '52%', top: '28%', right: '8%', zIndex: 1 },
        { width: '58%', height: '58%', top: '65%', left: '12%', zIndex: 3 },
      ],
    ],
    // 4 images layouts
    4: [
      [
        { width: '55%', height: '52%', top: '3%', left: '2%', zIndex: 3 },
        { width: '48%', height: '48%', top: '8%', right: '3%', zIndex: 2 },
        { width: '50%', height: '50%', top: '58%', left: '5%', zIndex: 1 },
        { width: '44%', height: '44%', top: '65%', right: '6%', zIndex: 4 },
      ],
    ],
  }

  const imageLayouts = layouts[totalImages]
  if (!imageLayouts) return layouts[2][0][0] // fallback

  // For 3-image layouts, rotate through patterns based on itemId
  const patternIndex = totalImages === 3 ? (itemId - 1) % imageLayouts.length : 0
  return imageLayouts[patternIndex][imageIndex] || imageLayouts[0][0]
}

/* ----------------------- Visual atoms ----------------------- */

/** Truly static page background (never moves) */
function FixedPageBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background:
          'radial-gradient(1100px 700px at 80% -20%, rgba(0,0,0,0.06), transparent), linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
      }}
    />
  )
}

/** A parallax layer that uses Lenis smooth scroll */
function ParallaxLayer({
  children,
  speed,
  offset = 0,
  style,
  className,
}: {
  children: React.ReactNode
  /** speed in px moved per px scrolled within the section (e.g. 0.15) */
  speed: number
  /** extra offset in px if you want to nudge initial position */
  offset?: number
  style?: React.CSSProperties
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sectionTopRef = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Calculate section top position
    const updateSectionTop = () => {
      const rect = el.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      sectionTopRef.current = scrollY + rect.top
    }

    // Initial calculation
    updateSectionTop()

    // Update transform based on scroll
    const updateTransform = (scroll: number) => {
      if (!el) return
      const translateY = (scroll - sectionTopRef.current) * speed + offset
      el.style.transform = `translate3d(0, ${translateY}px, 0)`
    }

    // Try to use Lenis if available, fallback to native scroll
    const lenis = window.lenis

    let cleanup: (() => void) | undefined

    if (lenis) {
      // Use Lenis smooth scroll
      cleanup = lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        updateTransform(scroll)
      })
      // Update immediately with current scroll
      updateTransform(lenis.scroll)
    } else {
      // Fallback to native scroll with rAF
      let rafId = 0
      const loop = () => {
        const scrollY = window.scrollY || window.pageYOffset
        updateTransform(scrollY)
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)
      cleanup = () => cancelAnimationFrame(rafId)
    }

    const ro = new ResizeObserver(updateSectionTop)
    ro.observe(el)
    window.addEventListener('resize', updateSectionTop)
    window.addEventListener('orientationchange', updateSectionTop)

    return () => {
      cleanup?.()
      ro.disconnect()
      window.removeEventListener('resize', updateSectionTop)
      window.removeEventListener('orientationchange', updateSectionTop)
    }
  }, [speed, offset])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ----------------------- Item ----------------------- */

interface PortfolioItemProps {
  item: PortfolioItem
  index: number
}

const PortfolioItemComponent = ({ item }: PortfolioItemProps) => {
  // per-item speeds: tweak to taste
  const imageSpeeds = useMemo(() => {
    // back layers slower, front layers faster
    // e.g. first image 0.06, then 0.11, 0.16, 0.21
    return item.images.map((_, i) => 0.06 + i * 0.05)
  }, [item.images.length])

  const textSpeed = 0.18 // text scrolls a bit faster than most images for "foreground" feel

  return (
    <>
      {/* Project Title - appears first */}
      <ParallaxLayer speed={textSpeed} className="relative z-50">
        <div className="relative bg-transparent py-20 sm:py-32 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div style={{ mixBlendMode: 'difference' }}>
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase text-black opacity-90 mb-3 sm:mb-4">
                {item.category}
              </p>
              <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 sm:mb-6 text-black">
                {item.title}
              </h3>
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-black leading-relaxed mb-8 sm:mb-12">
                {item.subtitle}
              </p>
            </div>
            <a
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/link pointer-events-auto bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-shadow"
              style={{ mixBlendMode: 'normal' }}
            >
              <span className="text-lg sm:text-xl font-light text-black group-hover/link:text-gray-600 transition-colors">
                Visit Website →
              </span>
            </a>
          </div>
        </div>
      </ParallaxLayer>

      {/* Project Images - appear after title with parallax */}
      <div className="relative h-screen overflow-hidden z-10">
        <div className="absolute inset-0">
          {item.images.map((image, imgIndex) => {
            const layout = getImageLayout(imgIndex, item.images.length, item.id)
            const speed = imageSpeeds[imgIndex] ?? 0.12
            return (
              <ParallaxLayer
                key={imgIndex}
                speed={speed}
                className="absolute overflow-hidden rounded-xl shadow-2xl"
                style={{
                  width: layout.width,
                  height: layout.height,
                  top: layout.top,
                  left: layout.left,
                  right: layout.right,
                  zIndex: layout.zIndex,
                }}
              >
                <img
                  src={image}
                  alt={`${item.title} ${imgIndex + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-full object-cover"
                />
              </ParallaxLayer>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ----------------------- Page ----------------------- */

export const Portfolio = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.1)

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-30px)',
    config: { tension: 120, friction: 20 },
  })

  return (
    <section id="portfolio" ref={ref} className="relative py-20 sm:py-32 px-4 md:px-8">
      {/* Static background that never moves */}
      <FixedPageBackground />

      <div className="max-w-7xl lg:max-w-[1600px] xl:max-w-[1800px] mx-auto">
        {/* Simple header with fade-in animation */}
        <animated.div style={titleSpring} className="mb-24 sm:mb-32 lg:mb-40">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
            PORTFOLIO
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-600 max-w-3xl">
            A curated selection of recent projects showcasing modern web solutions,
            from booking systems to enterprise applications.
          </p>
        </animated.div>

        {/* Portfolio items with parallax */}
        {portfolioItems.map((item, index) => (
          <div key={item.id} className={index === 0 ? 'mt-20 sm:mt-32 lg:mt-40' : ''}>
            <PortfolioItemComponent item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  )
}
