import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaCalendar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.id}`}>
      <motion.div
        className="relative rounded-xl overflow-hidden bg-dark-card dark:bg-dark-card shadow-lg card-hover cursor-pointer group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10 }}
      >
        {/* Movie Poster */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={movie.posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          {movie.rating && (
            <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black bg-opacity-70 px-3 py-1 rounded-full">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-white font-bold text-sm">{movie.rating}</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-text-dark dark:text-text-dark mb-2 truncate">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-text-muted mb-3">
            <span className="flex items-center">
              <FaClock className="mr-1" />
              {movie.duration} min
            </span>
            {movie.releaseDate && (
              <span className="flex items-center">
                <FaCalendar className="mr-1" />
                {new Date(movie.releaseDate).getFullYear()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genre && (
              <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary text-xs rounded-full font-medium">
                {movie.genre}
              </span>
            )}
            {movie.language && (
              <span className="px-3 py-1 bg-secondary bg-opacity-20 text-secondary text-xs rounded-full font-medium">
                {movie.language}
              </span>
            )}
          </div>

          {/* Book Now Button */}
          <motion.button
            className="w-full mt-4 py-2 bg-gradient-primary text-white font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity btn-glow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;
