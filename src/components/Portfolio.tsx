import React, { useEffect, useMemo, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

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
      '/thecretanpathfinders2.png',
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

const getImageLayout = (imageIndex: number, totalImages: number): ImageLayout => {
  const layouts: ImageLayout[][] = [
    // 2 images
    [
      { width: '50%', height: '60%', top: '10%', left: '5%', zIndex: 2 },
      { width: '40%', height: '50%', top: '40%', right: '10%', zIndex: 1 },
    ],
    // 3 images
    [
      { width: '45%', height: '55%', top: '5%', left: '5%', zIndex: 2 },
      { width: '35%', height: '45%', top: '15%', right: '8%', zIndex: 3 },
      { width: '42%', height: '50%', top: '55%', left: '25%', zIndex: 1 },
    ],
    // 4 images
    [
      { width: '38%', height: '48%', top: '5%', left: '5%', zIndex: 2 },
      { width: '32%', height: '42%', top: '12%', right: '8%', zIndex: 3 },
      { width: '40%', height: '50%', top: '52%', left: '8%', zIndex: 1 },
      { width: '30%', height: '38%', top: '60%', right: '15%', zIndex: 4 },
    ],
  ]
  const layoutIndex = Math.min(totalImages - 2, 2)
  return layouts[layoutIndex][imageIndex] || layouts[0][0]
}

/* ----------------------- Smooth scroll state ----------------------- */

/** Global, rAF-driven scroll values for super-smooth transforms */
function useRafScroll() {
  const scrollRef = useRef({
    y: 0,
    vh: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  const [, force] = React.useReducer((s) => s + 1, 0)

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      scrollRef.current.vh = window.innerHeight
    }
    const loop = () => {
      // read scroll once per frame
      scrollRef.current.y = window.scrollY || window.pageYOffset
      force()
      raf = requestAnimationFrame(loop)
    }
    onResize()
    raf = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return scrollRef.current
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

/** A parallax layer that uses the shared rAF scroll to stay smooth */
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
  const { y } = useRafScroll()
  const ref = useRef<HTMLDivElement>(null)
  const sectionTop = useSectionTop(ref)

  const translateY = (y - sectionTop) * speed + offset

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(0, ${translateY}px, 0)`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Get element's absolute top in document space; updates on resize */
function useSectionTop(trackRef: React.RefObject<HTMLElement | HTMLDivElement>) {
  const topRef = useRef(0)
  useEffect(() => {
    const update = () => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      topRef.current = (window.scrollY || window.pageYOffset) + rect.top
    }
    update()
    const ro = new ResizeObserver(update)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [trackRef])
  return topRef.current
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

  const textSpeed = 0.18 // text scrolls a bit faster than most images for “foreground” feel

  return (
    <>
      {/* Foreground parallax images on a pinned section height */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {item.images.map((image, imgIndex) => {
            const layout = getImageLayout(imgIndex, item.images.length)
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

      {/* Scrolling Text: same section top, its own (usually faster) speed */}
      <ParallaxLayer speed={textSpeed}>
        <div className="relative bg-transparent py-20 sm:py-32 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs sm:text-sm font-mono tracking-widest uppercase opacity-50 mb-3 sm:mb-4">
              {item.category}
            </p>
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 sm:mb-6">
              {item.title}
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-600 leading-relaxed mb-8 sm:mb-12">
              {item.subtitle}
            </p>
            <a
              href={`https://${item.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/link"
            >
              <span className="text-lg sm:text-xl font-light border-b-2 border-black group-hover/link:border-gray-400 transition-colors">
                Visit Website →
              </span>
            </a>
          </div>
        </div>
      </ParallaxLayer>
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
    <section ref={ref} className="relative py-20 sm:py-32 px-4 md:px-8">
      {/* Static background that never moves */}
      <FixedPageBackground />

      <div className="max-w-7xl mx-auto">
        <animated.div style={titleSpring} className="mb-16 sm:mb-24 lg:mb-32">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
            PORTFOLIO
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-600 max-w-3xl">
            A curated selection of recent projects showcasing modern web solutions,
            from booking systems to enterprise applications.
          </p>
        </animated.div>

        {portfolioItems.map((item, index) => (
          <PortfolioItemComponent key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
