import { useState } from 'react'
import { useGesture } from '@use-gesture/react'
import { animated, useSpring } from '@react-spring/web'

interface Project {
  id: number
  title: string
  url: string
  description: string
  tech: string[]
  x: number
  y: number
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Express Transfer Paros',
    url: 'expresstransferparos.com',
    description: 'Transfer company in Paros - Website + Booking System',
    tech: ['Vue', 'Vite', 'Tailwind'],
    x: 200,
    y: 200,
  },
  {
    id: 2,
    title: 'The Cretan Pathfinders',
    url: 'thecretanpathfinders.gr',
    description: 'Safari adventure company in Crete - Website + Booking System',
    tech: ['Vue', 'Vite', 'Tailwind'],
    x: 900,
    y: 300,
  },
  {
    id: 3,
    title: 'Cretan Royal Transfer',
    url: 'cretanroyaltransfer.gr',
    description: 'Transfer company in Crete - Website + Booking System',
    tech: ['Vue', 'Vite', 'Tailwind'],
    x: -100,
    y: 500,
  },
  {
    id: 4,
    title: 'AG Transfers',
    url: 'agtransfers.gr',
    description: 'Transfer company in Athens - Website + Booking System',
    tech: ['Vue', 'Vite', 'Tailwind'],
    x: 1300,
    y: 700,
  },
  {
    id: 5,
    title: 'MyServiceBook',
    url: 'myservicebook.gr',
    description: 'Vehicle service management system with Greek Chamber of Commerce integration',
    tech: ['Vue', 'Vite', 'Tailwind', 'Supabase', 'PostgreSQL', 'Python', 'Deno', 'FastAPI'],
    x: 500,
    y: 800,
  },
  {
    id: 6,
    title: 'BestMarket',
    url: 'Thesis Project',
    description: 'AI-powered multifactor decision making system for supermarket purchases',
    tech: ['React', 'Material-UI', 'Node.js', 'Express', 'Python', 'FastAPI', 'ML'],
    x: 1300,
    y: 1100,
  },
  {
    id: 7,
    title: 'stroke-prediction',
    url: 'Uni Project',
    description: 'Python App for showing the weather conditions in different parts of Greece using the openweather API',
    tech: ['Python', 'Pygame', 'OpenWeather API'],
    x: 100,
    y: 1050,
  },
]

interface BlueprintCanvasProps {
  onClose: () => void
}

export const BlueprintCanvas = ({ onClose }: BlueprintCanvasProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [scale, setScale] = useState(1)

  const [spring, api] = useSpring(() => ({
    x: 200,
    y: 20,
    scale: 1,
    config: { tension: 200, friction: 30 }, // Faster but still smooth
  }))

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 400 },
  })

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      api.start({ x, y })
    },
    onWheel: ({ event, delta: [, dy] }) => {
      event.preventDefault()
      const newScale = Math.min(Math.max(scale - dy * 0.001, 0.3), 2)
      setScale(newScale)
      api.start({ scale: newScale })
    },
    onPinch: ({ offset: [d] }) => {
      const newScale = Math.min(Math.max(d / 200, 0.3), 2)
      setScale(newScale)
      api.start({ scale: newScale })
    },
  })


  return (
    <animated.div style={fadeIn} className="fixed inset-0 bg-gray-700 z-50 overflow-hidden">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 z-50 text-white text-3xl sm:text-4xl hover:opacity-70 transition-opacity active:scale-90"
      >
        ×
      </button>

      {/* Instructions */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-white/70 text-xs sm:text-sm font-mono">
        <p>DRAG TO EXPLORE</p>
        <p className="hidden sm:block">CLICK NODES FOR DETAILS</p>
        <p className="sm:hidden">TAP NODES FOR DETAILS</p>
      </div>

      {/* Draggable Canvas */}
      <animated.div
        {...bind()}
        style={{
          x: spring.x,
          y: spring.y,
          scale: spring.scale,
          cursor: 'grab',
          touchAction: 'none',
        }}
        className="absolute inset-0 w-[2500px] h-[2000px]"
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {projects.map((project, i) => {
            if (i < projects.length - 1) {
              const next = projects[i + 1]
              return (
                <line
                  key={`line-${project.id}`}
                  x1={project.x + 150}
                  y1={project.y + 100}
                  x2={next.x + 150}
                  y2={next.y + 100}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )
            }
            return null
          })}
        </svg>

        {/* Project nodes */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="absolute bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 sm:p-6 w-64 sm:w-80 cursor-pointer hover:bg-white/20 active:bg-white/25 transition-colors"
            style={{
              left: project.x,
              top: project.y,
            }}
            onClick={() => setSelectedProject(project)}
          >
            <div className="text-white">
              <div className="text-xs font-mono opacity-50 mb-2">NODE #{project.id}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight">{project.title}</h3>
              <p className="text-xs sm:text-sm opacity-70 mb-3 line-clamp-2">{project.description}</p>
              <div className="text-xs font-mono text-blue-200 truncate">{project.url}</div>
            </div>
          </div>
        ))}
      </animated.div>

      {/* Project detail panel */}
      {selectedProject && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 sm:p-6 md:p-8 max-h-[50vh] sm:max-h-80 overflow-y-auto">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-2xl sm:text-3xl hover:opacity-70 active:scale-90"
          >
            ×
          </button>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 pr-8">{selectedProject.title}</h3>
          <a
            href={`https://${selectedProject.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mb-3 sm:mb-4 block text-sm sm:text-base"
          >
            {selectedProject.url}
          </a>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">{selectedProject.description}</p>
          <div>
            <h4 className="font-semibold mb-2 text-sm sm:text-base">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </animated.div>
  )
}
