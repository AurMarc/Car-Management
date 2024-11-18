export const testApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/')
    const data = await response.json()
    console.log('API Connection Test:', data)
    return data
  } catch (error) {
    console.error('API Connection Error:', error)
    throw error
  }
} 