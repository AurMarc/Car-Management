import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { carService } from '../services/carService'

function ProductCreate() {
  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewIndex, setPreviewIndex] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('tags[car_type]', formData.tags.car_type)
      formDataToSend.append('tags[company]', formData.tags.company)
      formDataToSend.append('tags[dealer]', formData.tags.dealer)

      files.forEach(file => {
        formDataToSend.append('images', file)
      })

      await carService.createCar(formDataToSend)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create car')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 10) {
      setError('Maximum 10 images allowed')
      return
    }
    setFiles(selectedFiles)
    setPreviewIndex(0)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-zinc-400 hover:text-white mb-6 
                   transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Vehicle</h2>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-zinc-400">Vehicle Images (Max 10)</label>
              <div className="flex flex-col items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-zinc-800/50 
                               text-zinc-400 rounded-lg border-2 border-zinc-700 border-dashed
                               cursor-pointer hover:border-blue-500/50 transition-colors duration-200">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Click to upload or drag and drop</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept="image/*"
                    required
                  />
                </label>
              </div>

              {/* Image Preview */}
              {files.length > 0 && (
                <div className="space-y-4">
                  {/* Main Preview */}
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-zinc-800">
                    <img
                      src={URL.createObjectURL(files[previewIndex])}
                      alt={`Preview ${previewIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {Array.from(files).map((file, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPreviewIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2
                                 transition-all duration-200 ${
                                   previewIndex === index 
                                     ? 'border-blue-500 ring-2 ring-blue-500/50' 
                                     : 'border-zinc-800 hover:border-zinc-700'
                                 }`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                           placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                           focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter vehicle title"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                           placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                           focus:ring-1 focus:ring-blue-500"
                  rows="4"
                  placeholder="Enter vehicle description"
                  required
                />
              </div>

              {/* Tags Section */}
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/50 p-4 space-y-4">
                <h3 className="text-white font-medium">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-2">Car Type</label>
                    <input
                      type="text"
                      value={formData.tags.car_type}
                      onChange={(e) => setFormData({
                        ...formData,
                        tags: { ...formData.tags, car_type: e.target.value }
                      })}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                               placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                               focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., SUV, Sedan"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.tags.company}
                      onChange={(e) => setFormData({
                        ...formData,
                        tags: { ...formData.tags, company: e.target.value }
                      })}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                               placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                               focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Toyota, BMW"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-2">Dealer</label>
                    <input
                      type="text"
                      value={formData.tags.dealer}
                      onChange={(e) => setFormData({
                        ...formData,
                        tags: { ...formData.tags, dealer: e.target.value }
                      })}
                      className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white
                               placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                               focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter dealer name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transition-colors duration-200
                       disabled:bg-blue-500/50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent 
                               rounded-full animate-spin mr-2"></div>
                  Creating Vehicle...
                </div>
              ) : (
                'Create Vehicle'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductCreate