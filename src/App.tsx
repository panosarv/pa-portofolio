import { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { Loader } from './components/Loader'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Portfolio } from './components/Portfolio'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Certifications } from './components/Certifications'
import { Contact } from './components/Contact'

function App() {
  const [loading, setLoading] = useState(true)
  useLenis()

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />
  }

  return (
    <div className="overflow-x-hidden">
      <Hero />
      <About />
      <Portfolio />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
    </div>
  )
}

export default App
