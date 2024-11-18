import { useEffect } from 'react'
import { API_URL } from '../services/config'

function ApiDocsRedirect() {
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/docs`)
        const data = await response.json()
        window.location.href = data.links.postman
      } catch (error) {
        console.error('Failed to fetch API docs:', error)
      }
    }
    fetchDocs()
  }, [])

  return <div>Redirecting to API documentation...</div>
}

export default ApiDocsRedirect 