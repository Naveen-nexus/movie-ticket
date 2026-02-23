import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { bookingAPI } from '../utils/api';
import toast from 'react-hot-toast';

const BookingSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [booking, setBooking] = useState(null);

  // Get booking data from session storage
  const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');

  if (!bookingData.showtimeId) {
    navigate('/movies');
    return null;
  }

  const { showtime, selectedSeats, totalAmount } = bookingData;

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await bookingAPI.createBooking({
        showtimeId: bookingData.showtimeId,
        seatIds: selectedSeats.map(s => s.id),
        paymentMethod: 'WALLET',
      });

      setBooking(response.data);
      setShowSuccess(true);
      sessionStorage.removeItem('bookingData');
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Booking failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess && booking) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          className="max-w-2xl w-full glass rounded-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <FaCheckCircle className="text-8xl text-green-400 mx-auto mb-6" />
          </motion.div>

          <h1 className="text-4xl font-bold gradient-text mb-4">Booking Confirmed!</h1>
          <p className="text-text-muted mb-8">Your tickets have been booked successfully</p>

          <div className="bg-dark-card dark:bg-dark-card rounded-xl p-6 mb-8">
            <div className="mb-6">
              <p className="text-text-muted text-sm mb-2">Booking Reference ID</p>
              <p className="text-3xl font-bold text-primary">{booking.bookingCode}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-text-muted text-sm">Movie</p>
                <p className="font-semibold">{booking.movieTitle}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Theatre</p>
                <p className="font-semibold">{booking.theatreName}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Date & Time</p>
                <p className="font-semibold">{booking.showDate} {booking.showTime}</p>
              </div>
              <div>
                <p className="text-text-muted text-sm">Seats</p>
                <p className="font-semibold">{booking.seatNumbers?.join(', ')}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-dark-border dark:border-dark-border">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Paid</span>
                <span className="text-primary">${booking.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate('/my-bookings')}
              className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow"
              whileHover={{ scale: 1.02 }}
            >
              View My Bookings
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border font-bold rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary hover:text-primary-600 mb-6"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="max-w-2xl mx-auto">
          {/* Booking Summary */}
          <div className="glass rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-text-muted">Movie</span>
                <span className="font-semibold">{showtime.movieTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Theatre</span>
                <span className="font-semibold">{showtime.theatreName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Date & Time</span>
                <span className="font-semibold">{showtime.showDate} {showtime.showTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Seats</span>
                <span className="font-semibold">{selectedSeats.map(s => s.seatNumber).join(', ')}</span>
              </div>
            </div>

            <div className="border-t border-dark-border dark:border-dark-border pt-4 flex justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-primary">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <motion.button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-gradient-primary text-white font-bold rounded-lg btn-glow disabled:opacity-50 text-lg"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2" />
                Processing...
              </div>
            ) : (
              `Pay $${totalAmount.toFixed(2)}`
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
