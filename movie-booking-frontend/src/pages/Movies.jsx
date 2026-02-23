import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { movieAPI } from '../utils/api';
import MovieCard from '../components/MovieCard';
import toast from 'react-hot-toast';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [genres, setGenres] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, selectedGenre, selectedLanguage, movies]);

  const fetchData = async () => {
    try {
      const [moviesRes, genresRes, languagesRes] = await Promise.all([
        movieAPI.getAllMovies(),
        movieAPI.getGenres(),
        movieAPI.getLanguages(),
      ]);

      setMovies(moviesRes.data);
      setFilteredMovies(moviesRes.data);
      setGenres(genresRes.data);
      setLanguages(languagesRes.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load movies');
      setLoading(false);
    }
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie => movie.genre === selectedGenre);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(movie => movie.language === selectedLanguage);
    }

    setFilteredMovies(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">All Movies</h1>
          <p className="text-text-muted">Browse and book your favorite movies</p>
        </motion.div>

        {/* Search and Filters */}
        {/* REVIEW 2: DISABLED - Search and Filter functionality */}
        <div className="mb-8 space-y-4">
          {/* Search Bar - DISABLED */}
          <div className="relative opacity-60">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => toast.error('Search feature will be available in Review 3')}
              placeholder="Search movies... (Available in Review 3)"
              disabled
              className="w-full pl-12 pr-4 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg outline-none text-text-dark dark:text-text-dark cursor-not-allowed"
            />
          </div>

          {/* Filters - DISABLED */}
          <div className="flex flex-wrap gap-4 opacity-60">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-text-muted" />
              <select
                value={selectedGenre}
                onChange={(e) => toast.error('Filter feature will be available in Review 3')}
                disabled
                className="px-4 py-2 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg outline-none text-text-dark dark:text-text-dark cursor-not-allowed"
              >
                <option value="">All Genres (Review 3)</option>
              </select>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => toast.error('Filter feature will be available in Review 3')}
              disabled
              className="px-4 py-2 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg outline-none text-text-dark dark:text-text-dark cursor-not-allowed"
            >
              <option value="">All Languages (Review 3)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-text-muted mb-6">
          Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
        </p>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-text-muted">No movies found</p>
            <p className="text-text-muted mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
