import { API_URL, getAuthHeaders } from './config'

export const authService = {
  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials)
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to login')
      }
      
      const data = await response.json()
      console.log('Login response:', data) // Debug log
      
      // Store the token exactly as received from the backend
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  
  async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to signup')
      }
      
      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      return data
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async logout() {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
      })
      
      localStorage.removeItem('token')
      return response.ok
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
    
  }
  
}