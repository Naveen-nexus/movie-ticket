import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaClock, FaCalendar, FaFilm, FaLanguage } from 'react-icons/fa';
import { movieAPI, showtimeAPI, theatreAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShowtimes();
    }
  }, [selectedDate, selectedCity, movie]);

  const fetchData = async () => {
    try {
      const [movieRes, citiesRes] = await Promise.all([
        movieAPI.getMovieById(id),
        theatreAPI.getCities(),
      ]);

      setMovie(movieRes.data);
      setCities(citiesRes.data);
      if (citiesRes.data.length > 0) {
        setSelectedCity(citiesRes.data[0]);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load movie details');
      setLoading(false);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await showtimeAPI.getShowtimesByMovie(id, {
        city: selectedCity,
        date: selectedDate,
      });
      setShowtimes(response.data);
    } catch (error) {
      console.error('Failed to load showtimes');
    }
  };

  const handleShowtimeSelect = (showtimeId) => {
    navigate(`/seat-selection/${showtimeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-text-muted">Movie not found</p>
      </div>
    );
  }

  // Group showtimes by theatre
  const showtimesByTheatre = showtimes.reduce((acc, showtime) => {
    const theatre = showtime.theatreName;
    if (!acc[theatre]) {
      acc[theatre] = [];
    }
    acc[theatre].push(showtime);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={movie.bannerUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <motion.img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            />

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <motion.h1
                className="text-5xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {movie.title}
              </motion.h1>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold">{movie.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  <FaClock />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  <FaFilm />
                  <span>{movie.genre}</span>
                </div>
                <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
                  <FaLanguage />
                  <span>{movie.language}</span>
                </div>
              </div>

              <p className="text-lg text-gray-300 mb-4 max-w-3xl">
                {movie.description}
              </p>

              <div className="space-y-2">
                <p><strong>Director:</strong> {movie.director}</p>
                <p><strong>Cast:</strong> {movie.cast}</p>
                <p><strong>Release Date:</strong> {format(new Date(movie.releaseDate), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 gradient-text">Book Tickets</h2>

        {/* Date and City Selection */}
        {/* REVIEW 2: DISABLED - Date and City filters */}
        <div className="flex flex-wrap gap-4 mb-8 opacity-60">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => toast.error('Date selection will be available in Review 3')}
            disabled
            min={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg outline-none text-text-dark dark:text-text-dark cursor-not-allowed"
          />

          <select
            value={selectedCity}
            onChange={(e) => toast.error('City filter will be available in Review 3')}
            disabled
            className="px-4 py-2 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg outline-none text-text-dark dark:text-text-dark cursor-not-allowed"
          >
            <option value="">Select City (Review 3)</option>
          </select>
        </div>

        {/* Showtimes by Theatre */}
        {Object.keys(showtimesByTheatre).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(showtimesByTheatre).map(([theatre, times]) => (
              <motion.div
                key={theatre}
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold mb-2">{theatre}</h3>
                <p className="text-text-muted mb-4">{times[0]?.city}</p>

                <div className="flex flex-wrap gap-3">
                  {times.map(showtime => (
                    <motion.button
                      key={showtime.id}
                      onClick={() => handleShowtimeSelect(showtime.id)}
                      className="px-6 py-3 bg-dark-card dark:bg-dark-card border-2 border-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div>{showtime.showTime}</div>
                      <div className="text-sm text-text-muted">${showtime.price}</div>
                      <div className="text-xs text-green-400">{showtime.availableSeats} seats</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-text-muted">No showtimes available</p>
            <p className="text-text-muted mt-2">Try selecting a different date or city</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
