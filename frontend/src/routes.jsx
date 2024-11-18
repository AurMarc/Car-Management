import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Navbar from './components/Navbar'
import ProductList from './pages/ProductList'
import ProductCreate from './pages/ProductCreate'
import ProductDetail from './pages/ProductDetail'
import ProtectedRoute from './components/ProtectedRoute'
import ApiDocsRedirect from './components/ApiDocsRedirect'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    
    <Routes>
      <Route path="/api/docs" element={<ApiDocsRedirect />} />
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} 
      />
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />
      <Route 
        path="/login" 
        element={<Navigate to="/auth?mode=login" replace />} 
      />
      <Route 
        path="/signup" 
        element={<Navigate to="/auth?mode=signup" replace />} 
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/dashboard" 
          element={
            <>
              <Navbar />
              <ProductList />
            </>
          } 
        />
        <Route 
          path="/create" 
          element={
            <>
              <Navbar />
              <ProductCreate />
            </>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <>
              <Navbar />
              <ProductDetail />
            </>
          } 
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes