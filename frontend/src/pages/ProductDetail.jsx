import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { carService } from '../services/carService'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: {
      car_type: '',
      company: '',
      dealer: ''
    }
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCar()
  }, [id])

  const loadCar = async () => {
    try {
      const response = await carService.getCarById(id)
      const carData = response.data.car
      setCar(carData)
      setFormData({
        title: carData.title,
        description: carData.description,
        tags: carData.tags || { car_type: '', company: '', dealer: '' }
      })
    } catch (err) {
      setError(err.message || 'Failed to load car')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        setLoading(true)
        const result = await carService.deleteCar(id)
        if (result.success) {
          navigate('/dashboard', { replace: true })
        }
      } catch (err) {
        setError(err.message || 'Failed to delete vehicle')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tags[car_type]', formData.tags.car_type)
      formDataToSend.append('tags[company]', formData.tags.company)
      formDataToSend.append('tags[dealer]', formData.tags.dealer)

      files.forEach(file => {
        formDataToSend.append('images', file)
      })

      const response = await carService.updateCar(id, formDataToSend)
      const updatedCar = response.data.car
      setCar(updatedCar)
      setIsEditing(false)
      setFiles([])
    } catch (err) {
      setError(err.message || 'Failed to update car')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const totalImages = selectedFiles.length + (car?.images?.length || 0)
    
    if (totalImages > 10) {
      setError('Maximum 10 images allowed in total')
      return
    }
    setFiles(selectedFiles)
  }

  const handleRemoveImage = async (imageUrl) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        await carService.removeImage(id, imageUrl)
        loadCar()
      } catch (err) {
        setError(err.message || 'Failed to remove image')
      }
    }
  }

  const handleNextImage = () => {
    if (car?.images?.length) {
      setSelectedImageIndex((prev) => 
        prev === car.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handlePrevImage = () => {
    if (car?.images?.length) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? car.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-zinc-400 hover:text-white mb-6 
                   transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vehicles
        </button>

        {isEditing ? (
          // Edit Form Section
          <div className="space-y-6 bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <div>
              <label className="block text-zinc-400 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Tags Input */}
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(formData.tags).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-zinc-400 mb-2">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      tags: { ...formData.tags, [key]: e.target.value }
                    })}
                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                             focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-zinc-400 mb-2">Images</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-zinc-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-500 file:text-white
                         hover:file:bg-blue-600"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg
                         hover:bg-blue-600 transition-colors duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 bg-zinc-700 text-white rounded-lg
                         hover:bg-zinc-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Image Gallery - Takes up 3 columns */}
            <div className="lg:col-span-3 space-y-4">
              {car.images && car.images.length > 0 ? (
                <div className="relative">
                  {/* Main Image */}
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden 
                               border-2 border-zinc-800">
                    <img
                      src={car.images[selectedImageIndex]}
                      alt={car.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Navigation Buttons */}
                  {car.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                                 bg-black/50 text-white hover:bg-black/75 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                                 bg-black/50 text-white hover:bg-black/75 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {car.images.length}
                  </div>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 rounded-xl bg-zinc-800 
                             flex items-center justify-center">
                  <span className="text-zinc-600">No Images Available</span>
                </div>
              )}

              {/* Thumbnail Strip */}
              {car.images && car.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2
                               transition-all duration-200 ${
                                 selectedImageIndex === index 
                                   ? 'border-blue-500 ring-2 ring-blue-500/50' 
                                   : 'border-zinc-800 hover:border-zinc-700'
                               }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white">{car.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-zinc-800 text-blue-400 rounded-lg 
                             hover:bg-zinc-700 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-zinc-800 text-red-400 rounded-lg 
                             hover:bg-zinc-700 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-zinc-400 whitespace-pre-line leading-relaxed">
                {car.description}
              </p>

              {/* Tags Section */}
              {car.tags && Object.entries(car.tags).length > 0 && (
                <div className="space-y-4 bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
                  <h3 className="text-lg font-medium text-white">Vehicle Details</h3>
                  <div className="space-y-3">
                    {Object.entries(car.tags).map(([key, value]) => (
                      value && (
                        <div 
                          key={key}
                          className="flex justify-between items-center p-3 bg-zinc-800/50 
                                   rounded-lg border border-zinc-700/50"
                        >
                          <span className="text-zinc-400">
                            {key.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="flex items-center justify-between text-sm text-zinc-500 
                            border-t border-zinc-800 pt-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Listed {new Date(car.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {car.views || 0} views
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail