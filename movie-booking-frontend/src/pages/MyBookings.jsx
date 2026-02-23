import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt, FaCalendar, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import { bookingAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  // REVIEW 2: DISABLED - Cancel Booking Feature
  const handleCancelBooking = async (bookingId) => {
    toast.error('Cancel booking feature will be available in the final version (Review 3)');
    return;
    
    // ORIGINAL CODE (Will be restored in Review 3):
    // if (!window.confirm('Are you sure you want to cancel this booking?')) {
    //   return;
    // }
    // try {
    //   await bookingAPI.cancelBooking(bookingId);
    //   toast.success('Booking cancelled successfully');
    //   fetchBookings();
    // } catch (error) {
    //   toast.error(error.response?.data?.error || 'Failed to cancel booking');
    // }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.bookingStatus.toLowerCase() === filter.toLowerCase();
  });

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
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">My Bookings</h1>
          <p className="text-text-muted">View and manage your ticket bookings</p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8">
          <FilterTab
            label="All"
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            count={bookings.length}
          />
          <FilterTab
            label="Confirmed"
            active={filter === 'confirmed'}
            onClick={() => setFilter('confirmed')}
            count={bookings.filter(b => b.bookingStatus === 'CONFIRMED').length}
          />
          <FilterTab
            label="Cancelled"
            active={filter === 'cancelled'}
            onClick={() => setFilter('cancelled')}
            count={bookings.filter(b => b.bookingStatus === 'CANCELLED').length}
          />
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelBooking}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FaTicketAlt className="text-6xl text-text-muted mx-auto mb-4" />
            <p className="text-2xl text-text-muted">No bookings found</p>
            <p className="text-text-muted mt-2">
              {filter === 'all' 
                ? "You haven't booked any tickets yet"
                : `No ${filter} bookings`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterTab = ({ label, active, onClick, count }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
        active
          ? 'bg-gradient-primary text-white shadow-glow'
          : 'bg-dark-card dark:bg-dark-card hover:bg-opacity-80'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label} ({count})
    </motion.button>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  const isCancelled = booking.bookingStatus === 'CANCELLED';
  const canCancel = booking.bookingStatus === 'CONFIRMED';

  return (
    <motion.div
      className="glass rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Booking Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{booking.movieTitle}</h3>
              <p className="text-text-muted">{booking.theatreName}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isCancelled
                ? 'bg-red-500 bg-opacity-20 text-red-500'
                : 'bg-green-500 bg-opacity-20 text-green-500'
            }`}>
              {booking.bookingStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-primary" />
              <div>
                <p className="text-text-muted">Date & Time</p>
                <p className="font-semibold">{booking.showDate} {booking.showTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaTicketAlt className="text-primary" />
              <div>
                <p className="text-text-muted">Seats</p>
                <p className="font-semibold">{booking.seatNumbers?.join(', ')}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-primary" />
              <div>
                <p className="text-text-muted">Booking Code</p>
                <p className="font-semibold">{booking.bookingCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col justify-between items-end">
          <div className="text-right mb-4">
            <p className="text-text-muted text-sm">Total Amount</p>
            <p className="text-3xl font-bold text-primary">${booking.totalAmount}</p>
            <p className="text-xs text-text-muted">{booking.paymentMethod}</p>
          </div>

          {/* REVIEW 2: DISABLED - Cancel Booking Button */}
          {canCancel && (
            <motion.button
              onClick={() => toast.error('Cancel feature will be available in Review 3')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 bg-opacity-20 text-gray-500 rounded-lg cursor-not-allowed opacity-50"
              title="Available in Review 3"
            >
              <FaTrash />
              <span>Cancel (Review 3)</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyBookings;
