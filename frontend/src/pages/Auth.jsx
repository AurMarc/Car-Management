import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import loginBg from '../assets/images/login-bg.jpg' 
import './Auth.css' 

export default function Auth() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const [isLoginForm, setIsLoginForm] = useState(mode !== 'signup')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    setIsLoginForm(mode !== 'signup')
  }, [mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLoginForm) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        })
        if (response.token) {
          login(response.token)
          navigate('/dashboard', { replace: true })
        }
      } else {
        const response = await authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        if (response.token) {
          login(response.token)
          navigate('/dashboard', { replace: true })
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const toggleForm = () => {
    const newMode = isLoginForm ? 'signup' : 'login'
    navigate(`/auth?mode=${newMode}`)
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Auth Form Container */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-2xl border border-gray-800">
          {/* Logo/Title Section */}
          <div className="text-center">
            <h2 className="font-black text-3xl text-white mb-2">
              {isLoginForm ? 'Welcome Back' : 'Join RideFlow'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isLoginForm 
                ? 'Sign in to access your account' 
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-900 bg-opacity-40 border border-red-500 text-red-300 px-4 py-3 rounded relative">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Auth Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field - Only for Signup */}
              {!isLoginForm && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLoginForm}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border
                             border-gray-700 bg-gray-900 text-gray-300 rounded-md
                             placeholder-gray-500 focus:outline-none focus:ring-blue-500
                             focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border
                           border-gray-700 bg-gray-900 text-gray-300 rounded-md
                           placeholder-gray-500 focus:outline-none focus:ring-blue-500
                           focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="email@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLoginForm ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="appearance-none relative block w-full px-3 py-2 border
                             border-gray-700 bg-gray-900 text-gray-300 rounded-md
                             placeholder-gray-500 focus:outline-none focus:ring-blue-500
                             focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                    placeholder={isLoginForm ? "Enter your password" : "Create a password"}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!isLoginForm && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border
                         border-transparent text-sm font-medium rounded-md text-white
                         bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                         focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400
                         disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLoginForm ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>

            {/* Toggle Form Type */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleForm}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                {isLoginForm 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}