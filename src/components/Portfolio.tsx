import { useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

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

interface ImageLayout {
  width: string
  height: string
  top: string
  left?: string
  right?: string
  zIndex: number
}

// Define different layouts for each image in a project
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

interface PortfolioItemProps {
  item: PortfolioItem
  index: number
}

const PortfolioItemComponent = ({ item, index }: PortfolioItemProps) => {
  return (
    <>
      {/* Fixed Background Images Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Fixed images layer */}
        <div className="absolute inset-0">
          {item.images.map((image, imgIndex) => {
            const layout = getImageLayout(imgIndex, item.images.length)

            return (
              <div
                key={imgIndex}
                className="absolute"
                style={{
                  width: layout.width,
                  height: layout.height,
                  top: layout.top,
                  left: layout.left,
                  right: layout.right,
                  zIndex: layout.zIndex,
                }}
              >
                <div
                  className="w-full h-full shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundAttachment: 'fixed',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Scrolling Text Section */}
      <div className="relative bg-white py-20 sm:py-32 px-4 md:px-8">
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
    </>
  )
}

export const Portfolio = () => {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useScrollAnimation(ref, 0.1)

  const titleSpring = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0px)' : 'translateY(-30px)',
    config: { tension: 120, friction: 20 },
  })

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <animated.div style={titleSpring} className="mb-16 sm:mb-24 lg:mb-32">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6 leading-tight">
            PORTFOLIO
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-gray-600 max-w-3xl">
            A curated selection of recent projects showcasing modern web solutions,
            from booking systems to enterprise applications.
          </p>
        </animated.div>

        {/* Portfolio Items */}
        <div>
          {portfolioItems.map((item, index) => (
            <PortfolioItemComponent
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
