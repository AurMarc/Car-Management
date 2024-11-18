import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import homeBg from '../assets/images/home-bg.jpg'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [textIndex, setTextIndex] = useState(0)
  const texts = [
    "Welcome to Smart Car Management",
    "Track Your Vehicle Details",
    "Manage Your Car Portfolio",
    "Real-time Vehicle Analytics",
    "Streamline Your Fleet Operations"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % texts.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-end p-6">
        <div className="space-x-4">
          <button
            onClick={() => navigate('/auth?mode=login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg 
                     transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="bg-transparent hover:bg-white text-white hover:text-blue-600 font-bold 
                     py-2 px-6 rounded-lg border-2 border-white transition duration-300 
                     ease-in-out transform hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-start mt-20 px-4">
        <h1 className="tesla-font text-white text-8xl mb-16 tracking-wider logo-position">
          RideFlow
        </h1>
        
        <div className="typing-container text-center text-position">
          <p className="text-white  text-3xl font-light">
            {texts[textIndex]}
            <span className="cursor">|</span>
          </p>
        </div>

        {/* Additional tagline */}
        
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-white text-sm p-6 text-center">
        © 2024 RideFlow. All rights reserved.
      </footer>
    </div>
  )
}

export default Home