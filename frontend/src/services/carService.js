import { API_URL, getAuthHeaders } from './config'

export const carService = {
    async getAllCars() {
      try {
        console.log('Fetching cars with headers:', getAuthHeaders()) // Debug log
        const response = await fetch(`${API_URL}/api/cars`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to fetch cars')
        }
        
        return await response.json()
      } catch (error) {
        console.error('getAllCars error:', error)
        if (error.message.includes('Invalid token')) {
          // Clear invalid token
          localStorage.removeItem('token')
        }
        throw error
      }
    },

  async getCarById(id) {
    const response = await fetch(`${API_URL}/api/cars/${id}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch car')
    }
    
    return await response.json()
  },

  async createCar(formData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/cars`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type here, let the browser set it with the boundary
      },
      credentials: 'include',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create car')
    }
    
    return await response.json()
  },

  async updateCar(id, formData) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update car')
    }
    
    return await response.json()
  },

  async deleteCar(id) {
    try {
      const response = await fetch(`${API_URL}/api/cars/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete car')
      }
      
      // Check if response has content before parsing
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }
      
      return { success: true } // Return a default success response if no JSON
    } catch (error) {
      console.error('deleteCar error:', error)
      throw error
    }
  }
} 