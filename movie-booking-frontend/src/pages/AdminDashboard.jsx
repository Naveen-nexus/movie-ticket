import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, FaFilm, FaTheaterMasks, FaTicketAlt, FaUsers, FaChartBar,
  FaPlus, FaClock, FaEdit, FaTrash, FaTimes, FaCheck, FaSearch
} from 'react-icons/fa';
import { adminAPI, movieAPI, theatreAPI, showtimeAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="flex">
        {/* Sidebar - Fixed */}
        <div className="w-64 min-h-screen bg-gradient-to-b from-dark-card to-dark-bg border-r border-dark-border fixed left-0 top-0 pt-20">
          <div className="p-6">
            <h2 className="text-2xl font-bold gradient-text mb-6">Admin Panel</h2>
            
            <nav className="space-y-2">
              <NavItem to="/admin" icon={<FaHome />} label="Dashboard" active={location.pathname === '/admin'} />
              <NavItem to="/admin/movies" icon={<FaFilm />} label="Movies" active={location.pathname === '/admin/movies'} />
              <NavItem to="/admin/theatres" icon={<FaTheaterMasks />} label="Theatres" active={location.pathname === '/admin/theatres'} />
              <NavItem to="/admin/showtimes" icon={<FaClock />} label="Showtimes" active={location.pathname === '/admin/showtimes'} />
              <NavItem to="/admin/bookings" icon={<FaTicketAlt />} label="Bookings" active={location.pathname === '/admin/bookings'} />
              <NavItem to="/admin/users" icon={<FaUsers />} label="Users" active={location.pathname === '/admin/users'} />
            </nav>
          </div>
        </div>

        {/* Main Content - With left margin to account for fixed sidebar */}
        <div className="flex-1 ml-64 p-8 pt-24">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/movies" element={<MoviesManagement />} />
            <Route path="/theatres" element={<TheatresManagement />} />
            <Route path="/showtimes" element={<ShowtimesManagement />} />
            <Route path="/bookings" element={<BookingsManagement />} />
            <Route path="/users" element={<UsersManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }) => {
  return (
    <Link to={to}>
      <motion.div
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
          active
            ? 'bg-gradient-primary text-white shadow-glow'
            : 'hover:bg-dark-card dark:hover:bg-dark-card'
        }`}
        whileHover={{ x: 5 }}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </motion.div>
    </Link>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch movies count
      const moviesRes = await movieAPI.getAllMovies();
      const theatresRes = await theatreAPI.getAllTheatres();
      const bookingsRes = await adminAPI.getAllBookings();
      const usersRes = await adminAPI.getAllUsers();

      setStats({
        totalMovies: moviesRes.data.length,
        totalTheatres: theatresRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalUsers: usersRes.data.length,
        totalRevenue: bookingsRes.data.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold gradient-text">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaFilm />} 
          label="Total Movies" 
          value={stats.totalMovies} 
          color="bg-gradient-to-br from-blue-500 to-blue-700" 
        />
        <StatCard 
          icon={<FaTheaterMasks />} 
          label="Total Theatres" 
          value={stats.totalTheatres} 
          color="bg-gradient-to-br from-green-500 to-green-700" 
        />
        <StatCard 
          icon={<FaTicketAlt />} 
          label="Total Bookings" 
          value={stats.totalBookings} 
          color="bg-gradient-to-br from-purple-500 to-purple-700" 
        />
        <StatCard 
          icon={<FaUsers />} 
          label="Total Users" 
          value={stats.totalUsers} 
          color="bg-gradient-to-br from-orange-500 to-orange-700" 
        />
      </div>

      {/* Revenue Card */}
      <div className="glass rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-2">Total Revenue</h3>
        <p className="text-5xl font-bold gradient-text">${stats.totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  return (
    <motion.div
      className={`${color} rounded-xl p-6 text-white shadow-lg`}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-5xl mb-4 opacity-80">{icon}</div>
      <p className="text-sm opacity-90 mb-1">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
    </motion.div>
  );
};

// MOVIES MANAGEMENT
const MoviesManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    language: '',
    releaseDate: '',
    rating: '',
    movieCast: '',
    director: '',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAllMovies();
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load movies');
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      duration: '',
      language: 'English',
      releaseDate: '',
      rating: '7.5',
      movieCast: '',
      director: '',
      posterUrl: '',
      bannerUrl: '',
      trailerUrl: '',
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await adminAPI.createMovie({
        ...formData,
        duration: parseInt(formData.duration),
        rating: parseFloat(formData.rating)
      });
      
      toast.success('Movie created successfully!');
      setShowModal(false);
      fetchMovies(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create movie');
    }
  };

  // REVIEW 2: DISABLED - Delete Movie Feature
  const handleDeleteMovie = async (movieId, movieTitle) => {
    toast.error('This feature will be available in the final version (Review 3)');
    return;
    
    // ORIGINAL CODE (Will be restored in Review 3):
    // if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
    //   return;
    // }
    // try {
    //   await adminAPI.deleteMovie(movieId);
    //   toast.success('Movie deleted successfully!');
    //   fetchMovies(); // Refresh the list
    // } catch (error) {
    //   toast.error(error.response?.data?.error || 'Failed to delete movie');
    // }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-text">Movies Management</h1>
        <motion.button
          onClick={handleOpenModal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          <span>Add New Movie</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMovies.map((movie) => (
          <motion.div
            key={movie.id}
            className="glass rounded-xl overflow-hidden"
            whileHover={{ y: -5 }}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
              <p className="text-text-muted text-sm mb-2">{movie.genre}</p>
              <p className="text-text-muted text-sm mb-4">{movie.duration} mins • {movie.language}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-500 font-bold">⭐ {movie.rating}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    movie.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {movie.status}
                  </span>
                </div>
                <motion.button
                  onClick={() => handleDeleteMovie(movie.id, movie.title)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete Movie"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Movie Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold gradient-text">Add New Movie</h2>
                <motion.button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-dark-card rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaTimes className="text-2xl" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Inception"
                    />
                  </div>

                  {/* Director */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Director *</label>
                    <input
                      type="text"
                      name="director"
                      value={formData.director}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Christopher Nolan"
                    />
                  </div>

                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Genre *</label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Action, Thriller, Sci-Fi"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Language *</label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., English"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Duration (minutes) *</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      min="1"
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 148"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Rating (0-10) *</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      min="0"
                      max="10"
                      step="0.1"
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 8.5"
                    />
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Release Date *</label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-bold mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="COMING_SOON">Coming Soon</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter movie description..."
                  />
                </div>

                {/* Cast */}
                <div>
                  <label className="block text-sm font-bold mb-2">Cast *</label>
                  <input
                    type="text"
                    name="movieCast"
                    value={formData.movieCast}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page"
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Poster URL *</label>
                    <input
                      type="url"
                      name="posterUrl"
                      value={formData.posterUrl}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://image.tmdb.org/t/p/w500/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Banner URL *</label>
                    <input
                      type="url"
                      name="bannerUrl"
                      value={formData.bannerUrl}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://image.tmdb.org/t/p/original/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Trailer URL</label>
                    <input
                      type="url"
                      name="trailerUrl"
                      value={formData.trailerUrl}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheck className="inline mr-2" />
                    Create Movie
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-dark-card border border-dark-border text-text-dark font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// THEATRES MANAGEMENT
const TheatresManagement = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    city: '',
    totalScreens: '',
    facilities: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const response = await theatreAPI.getAllTheatres();
      setTheatres(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load theatres');
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      location: '',
      city: '',
      totalScreens: '3',
      facilities: '',
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await adminAPI.createTheatre({
        ...formData,
        totalScreens: parseInt(formData.totalScreens)
      });
      
      toast.success('Theatre created successfully!');
      setShowModal(false);
      fetchTheatres(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create theatre');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-text">Theatres Management</h1>
        <motion.button
          onClick={handleOpenModal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
          whileHover={{ scale: 1.05 }}
        >
          <FaPlus />
          <span>Add New Theatre</span>
        </motion.button>
      </div>

      {/* Theatres List */}
      <div className="space-y-4">
        {theatres.map((theatre) => (
          <motion.div
            key={theatre.id}
            className="glass rounded-xl p-6"
            whileHover={{ x: 5 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{theatre.name}</h3>
                <p className="text-text-muted mb-2">📍 {theatre.location}, {theatre.city}</p>
                <p className="text-text-muted mb-2">🎬 {theatre.totalScreens} Screens</p>
                <p className="text-sm text-text-muted">✨ {theatre.facilities}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  theatre.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {theatre.status}
                </span>
                {/* REVIEW 2: DISABLED - Edit/Delete Theatre Buttons */}
                <motion.button
                  onClick={() => toast.error('Edit feature will be available in Review 3')}
                  className="p-3 bg-gray-500/20 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
                  title="Available in Review 3"
                >
                  <FaEdit />
                </motion.button>
                <motion.button
                  onClick={() => toast.error('Delete feature will be available in Review 3')}
                  className="p-3 bg-gray-500/20 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
                  title="Available in Review 3"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Theatre Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold gradient-text">Add New Theatre</h2>
                <motion.button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-dark-card rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaTimes className="text-2xl" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Theatre Name */}
                <div>
                  <label className="block text-sm font-bold mb-2">Theatre Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., PVR Cinemas Downtown"
                  />
                </div>

                {/* Location and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., New York"
                    />
                  </div>
                </div>

                {/* Total Screens and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Total Screens *</label>
                    <input
                      type="number"
                      name="totalScreens"
                      value={formData.totalScreens}
                      onChange={handleFormChange}
                      min="1"
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Facilities */}
                <div>
                  <label className="block text-sm font-bold mb-2">Facilities *</label>
                  <textarea
                    name="facilities"
                    value={formData.facilities}
                    onChange={handleFormChange}
                    required
                    rows="3"
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., IMAX, Dolby Atmos, Food Court, Parking"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheck className="inline mr-2" />
                    Create Theatre
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-dark-card border border-dark-border text-text-dark font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SHOWTIMES MANAGEMENT
const ShowtimesManagement = () => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    movieId: '',
    screenId: '',
    showDate: '',
    showTime: '',
    basePrice: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        movieAPI.getAllMovies(),
        theatreAPI.getAllTheatres()
      ]);
      setMovies(moviesRes.data);
      setTheatres(theatresRes.data);
      
      // Fetch all screens from all theatres
      const allScreens = [];
      for (const theatre of theatresRes.data) {
        try {
          const screensRes = await theatreAPI.getScreensByTheatre(theatre.id);
          screensRes.data.forEach(screen => {
            allScreens.push({
              ...screen,
              theatreName: theatre.name,
              theatreId: theatre.id
            });
          });
        } catch (error) {
          console.error(`Failed to load screens for theatre ${theatre.id}`);
        }
      }
      setScreens(allScreens);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  const fetchShowtimes = async (movieId) => {
    try {
      const response = await showtimeAPI.getShowtimesByMovie(movieId);
      setShowtimes(response.data);
    } catch (error) {
      toast.error('Failed to load showtimes');
    }
  };

  const handleMovieSelect = (movieId) => {
    setSelectedMovie(movieId);
    if (movieId) {
      fetchShowtimes(movieId);
    } else {
      setShowtimes([]);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      movieId: '',
      screenId: '',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '',
      basePrice: '10.99'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await adminAPI.createShowtime({
        movieId: parseInt(formData.movieId),
        screenId: parseInt(formData.screenId),
        showDate: formData.showDate,
        showTime: formData.showTime,
        basePrice: parseFloat(formData.basePrice)
      });
      
      toast.success('Showtime created successfully!');
      setShowModal(false);
      
      // Refresh showtimes if a movie is selected
      if (selectedMovie) {
        fetchShowtimes(selectedMovie);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create showtime');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-text">Showtimes Management</h1>
        {/* REVIEW 2: DISABLED - Add Showtime Button */}
        <motion.button
          onClick={() => toast.error('This feature will be available in the final version (Review 3)')}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg opacity-60 cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
        >
          <FaPlus />
          <span>Add New Showtime (Coming in Review 3)</span>
        </motion.button>
      </div>

      {/* Movie Selector */}
      <div className="glass rounded-xl p-6">
        <label className="block text-sm font-bold mb-3">Select Movie to View Showtimes</label>
        <select
          value={selectedMovie}
          onChange={(e) => handleMovieSelect(e.target.value)}
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Select a movie --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.language})
            </option>
          ))}
        </select>
      </div>

      {/* Showtimes List */}
      {selectedMovie && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Available Showtimes ({showtimes.length})</h3>
          {showtimes.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-text-muted text-lg">No showtimes available for this movie</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showtimes.map((showtime) => {
                const theatre = theatres.find(t => t.id === showtime.theatreId);
                return (
                  <motion.div
                    key={showtime.id}
                    className="glass rounded-xl p-5"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{theatre?.name || 'Unknown Theatre'}</h4>
                        <p className="text-text-muted text-sm">{showtime.screenName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        showtime.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                      }`}>
                        {showtime.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-muted mb-1">📅 {new Date(showtime.showDate).toLocaleDateString()}</p>
                        <p className="text-sm text-text-muted">🕐 {showtime.showTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${showtime.basePrice}</p>
                        <p className="text-xs text-text-muted">Base Price</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Showtime Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold gradient-text">Add New Showtime</h2>
                <motion.button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-dark-card rounded-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <FaTimes className="text-2xl" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Movie Selection */}
                <div>
                  <label className="block text-sm font-bold mb-2">Movie *</label>
                  <select
                    name="movieId"
                    value={formData.movieId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Select Movie --</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title} ({movie.language})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Screen Selection */}
                <div>
                  <label className="block text-sm font-bold mb-2">Screen *</label>
                  <select
                    name="screenId"
                    value={formData.screenId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Select Screen --</option>
                    {screens.map((screen) => (
                      <option key={screen.id} value={screen.id}>
                        {screen.theatreName} - {screen.screenName} ({screen.totalSeats} seats)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Show Date *</label>
                    <input
                      type="date"
                      name="showDate"
                      value={formData.showDate}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Show Time *</label>
                    <input
                      type="time"
                      name="showTime"
                      value={formData.showTime}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-bold mb-2">Base Price ($) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleFormChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaCheck className="inline mr-2" />
                    Create Showtime
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-3 bg-dark-card border border-dark-border text-text-dark font-bold rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// BOOKINGS MANAGEMENT
const BookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold gradient-text">All Bookings</h1>
      
      <div className="glass rounded-xl p-6">
        <p className="text-xl mb-6">Total Bookings: <span className="font-bold text-primary">{bookings.length}</span></p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4">Booking ID</th>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Movie</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Seats</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-dark-border hover:bg-dark-card transition-colors">
                  <td className="py-3 px-4">#{booking.bookingReference}</td>
                  <td className="py-3 px-4">{booking.userEmail}</td>
                  <td className="py-3 px-4">{booking.movieTitle}</td>
                  <td className="py-3 px-4">{new Date(booking.showDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{booking.seatNumbers?.join(', ')}</td>
                  <td className="py-3 px-4 font-bold text-primary">${booking.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500' :
                      booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// USERS MANAGEMENT
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load users');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="loading-spinner" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold gradient-text">Users Management</h1>
      
      <div className="glass rounded-xl p-6">
        <p className="text-xl mb-6">Total Users: <span className="font-bold text-primary">{users.length}</span></p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              className="bg-dark-card border border-dark-border rounded-xl p-5"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold">{user.fullName}</h3>
                    <p className="text-sm text-text-muted">{user.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  user.role === 'ADMIN' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {user.role}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-text-muted">📱 {user.phone}</p>
                <p className="text-sm text-text-muted">💰 Wallet: ${user.walletBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-text-muted">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
