import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Login from './pages/Login';

// Lazy load other pages
const MovieDetails = React.lazy(() => import('./pages/MovieDetails'));
const SeatSelection = React.lazy(() => import('./pages/SeatSelection'));
const BookingSummary = React.lazy(() => import('./pages/BookingSummary'));
const MyBookings = React.lazy(() => import('./pages/MyBookings'));
const Register = React.lazy(() => import('./pages/Register'));
const Theatres = React.lazy(() => import('./pages/Theatres'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminRegister = React.lazy(() => import('./pages/AdminRegister'));

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg dark:bg-dark-bg text-text-dark dark:text-text-dark">
        <Navbar />
        <React.Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="loading-spinner" />
            </div>
          }
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/theatres" element={<Theatres />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Protected Routes */}
            <Route
              path="/seat-selection/:showtimeId"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-summary"
              element={
                <ProtectedRoute>
                  <BookingSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
