import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Logout failed. Please try again.')
    }
  }

  return (
    <nav className="bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-200"
            >
              RideFlow
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/create"
              className="flex items-center px-4 py-2 bg-zinc-900 text-blue-400 rounded-lg
                       hover:bg-zinc-800 hover:text-blue-300 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vehicle
            </Link>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar