import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import { movieAPI } from '../utils/api';
import MovieCard from '../components/MovieCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(featuredMovies.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies]);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAllMovies();
      setFeaturedMovies(response.data.slice(0, 10));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load movies');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        {featuredMovies.slice(0, 5).map((movie, index) => (
          <motion.div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={movie.bannerUrl || movie.posterUrl || 'https://via.placeholder.com/1920x600'}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
            
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <motion.div
                className="max-w-2xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h1
                  className="text-6xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {movie.title}
                </motion.h1>
                
                <p className="text-xl text-gray-300 mb-6 line-clamp-3">
                  {movie.description}
                </p>

                <div className="flex items-center space-x-4 mb-8">
                  <span className="px-4 py-2 bg-primary rounded-full text-white font-semibold">
                    {movie.genre}
                  </span>
                  <span className="text-gray-300">
                    {movie.duration} min
                  </span>
                  {movie.rating && (
                    <span className="flex items-center text-yellow-400">
                      ⭐ {movie.rating}
                    </span>
                  )}
                </div>

                <Link to={`/movies/${movie.id}`}>
                  <motion.button
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay />
                    <span>Book Now</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredMovies.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-primary w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Now Showing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="text-4xl font-bold gradient-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Now Showing
          </motion.h2>
          <Link to="/movies">
            <motion.button
              className="flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
              whileHover={{ x: 5 }}
            >
              <span>View All</span>
              <FaArrowRight />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredMovies.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-dark-card dark:bg-dark-card py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl font-bold text-center gradient-text mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Why Choose TickeeHub?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎬"
              title="Latest Movies"
              description="Watch the latest blockbusters and indie films in stunning quality"
            />
            <FeatureCard
              icon="🪑"
              title="Seat Selection"
              description="Choose your perfect seat with our interactive seating layout"
            />
            <FeatureCard
              icon="💳"
              title="Easy Payment"
              description="Multiple payment options for a seamless booking experience"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="p-6 rounded-xl glass text-center"
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255, 60, 120, 0.3)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-text-dark dark:text-text-dark mb-2">
        {title}
      </h3>
      <p className="text-text-muted">{description}</p>
    </motion.div>
  );
};

export default Home;
