export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

