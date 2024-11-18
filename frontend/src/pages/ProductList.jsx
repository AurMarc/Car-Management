import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { carService } from '../services/carService'

function ProductList() {
  const [cars, setCars] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCars()
  }, [])

  const loadCars = async () => {
    try {
      const response = await carService.getAllCars()
      console.log('Cars response:', response)
      // Update this line based on your API response structure
      const carsData = Array.isArray(response.data) ? response.data : response.data.cars || []
      setCars(carsData)
    } catch (err) {
      console.error('Error loading cars:', err)
      setError(err.message || 'Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  const filteredCars = cars.filter(car =>
    car.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Add this skeleton loader component
  const CardSkeleton = () => (
    <div className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 animate-pulse">
      <div className="h-48 bg-zinc-800"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded w-full"></div>
        <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-zinc-800 rounded-full w-20"></div>
          <div className="h-6 bg-zinc-800 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar with icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white 
                     placeholder-zinc-500 focus:outline-none focus:border-blue-500 
                     focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-8 
                         backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Car Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map(car => (
              <Link 
                key={car._id}
                to={`/product/${car._id}`}
                className="group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800
                         hover:border-blue-500/50 hover:transform hover:scale-105 
                         hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.1)]
                         transition-all duration-300 backdrop-blur-sm"
              >
                {/* Image Gallery with Gradient Overlay */}
                <div className="relative h-48 overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <div className="flex overflow-x-auto snap-x">
                      {car.images.map((image, index) => (
                        <div key={index} className="relative w-full flex-shrink-0">
                          <img
                            src={image}
                            alt={`${car.title} - Image ${index + 1}`}
                            className="w-full h-48 object-cover snap-center
                                     group-hover:opacity-90 transition-opacity duration-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 bg-zinc-800 flex items-center justify-center">
                      <span className="text-zinc-600">No Image Available</span>
                    </div>
                  )}
                  
                  {/* Image Counter with Blur */}
                  {car.images && car.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-md
                                  text-zinc-300 px-2 py-1 rounded-md text-sm
                                  border border-white/10">
                      {car.images.length} images
                    </div>
                  )}
                </div>

                {/* Car Details with Better Typography */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 
                               group-hover:text-blue-400 transition-colors duration-200
                               truncate">
                    {car.title || 'Untitled Vehicle'}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {car.description || 'No description available'}
                  </p>
                  
                  {/* Tags with Glassmorphism */}
                  {car.tags && Object.entries(car.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(car.tags).map(([key, value]) => (
                        value && (
                          <span
                            key={key}
                            className="px-2 py-1 bg-zinc-800/50 text-zinc-400 text-xs rounded-full
                                     border border-zinc-700/50 backdrop-blur-sm
                                     group-hover:border-blue-500/20 transition-colors duration-200"
                          >
                            {key.replace('_', ' ')}: {value}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}


        {/* Empty State with Better Visual */}
        {!loading && !error && filteredCars.length === 0 && (
          <div className="text-center py-20 px-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
            <svg className="mx-auto h-12 w-12 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-zinc-400 text-lg mb-4">
              {cars.length === 0 
                ? 'No vehicles found. Add your first vehicle!' 
                : 'No vehicles match your search.'}
            </p>
            {cars.length === 0 && (
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg
                         hover:bg-blue-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vehicle
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList