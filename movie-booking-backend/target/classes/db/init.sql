-- ============================================
-- Movie Ticket Reservation System
-- Database Initialization Script
-- ============================================
-- Run this ONCE in Supabase SQL Editor
-- This creates all tables, indexes, constraints, and triggers
-- ============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS booking_seats CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS screens CASCADE;
DROP TABLE IF EXISTS theatres CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. MOVIES TABLE
-- ============================================
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    language VARCHAR(50),
    duration INTEGER NOT NULL,
    rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 10),
    release_date DATE,
    poster_url TEXT,
    banner_url TEXT,
    trailer_url TEXT,
    movie_cast TEXT,
    director VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'COMING_SOON')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for movies table
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_language ON movies(language);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_release_date ON movies(release_date);

-- ============================================
-- 3. THEATRES TABLE
-- ============================================
CREATE TABLE theatres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_screens INTEGER NOT NULL DEFAULT 1,
    facilities TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for theatres table
CREATE INDEX idx_theatres_city ON theatres(city);
CREATE INDEX idx_theatres_status ON theatres(status);

-- ============================================
-- 4. SCREENS TABLE
-- ============================================
CREATE TABLE screens (
    id BIGSERIAL PRIMARY KEY,
    theatre_id BIGINT NOT NULL REFERENCES theatres(id) ON DELETE CASCADE,
    screen_name VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL DEFAULT 100,
    seat_layout JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for screens table
CREATE INDEX idx_screens_theatre ON screens(theatre_id);

-- ============================================
-- 5. SHOWTIMES TABLE
-- ============================================
CREATE TABLE showtimes (
    id BIGSERIAL PRIMARY KEY,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    screen_id BIGINT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL CHECK (base_price > 0),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for showtimes table
CREATE INDEX idx_showtimes_movie ON showtimes(movie_id);
CREATE INDEX idx_showtimes_screen ON showtimes(screen_id);
CREATE INDEX idx_showtimes_date ON showtimes(show_date);
CREATE INDEX idx_showtimes_status ON showtimes(status);
CREATE INDEX idx_showtimes_movie_date ON showtimes(movie_id, show_date);

-- ============================================
-- 6. SEATS TABLE
-- ============================================
CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,
    showtime_id BIGINT NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
    seat_number VARCHAR(10) NOT NULL,
    row_number VARCHAR(5) NOT NULL,
    column_number VARCHAR(5) NOT NULL,
    seat_type VARCHAR(50) DEFAULT 'REGULAR' CHECK (seat_type IN ('REGULAR', 'PREMIUM', 'VIP')),
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOOKED', 'BLOCKED')),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(showtime_id, seat_number)
);

-- Indexes for seats table
CREATE INDEX idx_seats_showtime ON seats(showtime_id);
CREATE INDEX idx_seats_status ON seats(status);

-- ============================================
-- 7. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    showtime_id BIGINT NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'CANCELLED')),
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bookings table
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_showtime ON bookings(showtime_id);
CREATE INDEX idx_bookings_code ON bookings(booking_code);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- ============================================
-- 8. BOOKING_SEATS TABLE (Junction Table)
-- ============================================
CREATE TABLE booking_seats (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id BIGINT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id, seat_id)
);

-- Indexes for booking_seats table
CREATE INDEX idx_booking_seats_booking ON booking_seats(booking_id);
CREATE INDEX idx_booking_seats_seat ON booking_seats(seat_id);

-- ============================================
-- 9. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('PAYMENT', 'REFUND', 'WALLET_CREDIT', 'WALLET_DEBIT')),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for transactions table
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- 10. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, movie_id)
);

-- Indexes for reviews table
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_movie ON reviews(movie_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- 11. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO' CHECK (type IN ('INFO', 'SUCCESS', 'WARNING', 'ERROR')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- 12. USER_SETTINGS TABLE
-- ============================================
CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for user_settings table
CREATE INDEX idx_user_settings_user ON user_settings(user_id);

-- ============================================
-- 13. CREATE TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theatres_updated_at BEFORE UPDATE ON theatres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showtimes_updated_at BEFORE UPDATE ON showtimes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 14. CREATE VIEWS FOR ANALYTICS
-- ============================================

-- Daily Revenue View
CREATE OR REPLACE VIEW daily_revenue AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as bookings,
    SUM(total_amount) as revenue
FROM bookings
WHERE payment_status = 'COMPLETED' AND booking_status = 'CONFIRMED'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top Movies View
CREATE OR REPLACE VIEW top_movies AS
SELECT 
    m.id,
    m.title,
    m.poster_url,
    COUNT(DISTINCT b.id) as bookings
FROM movies m
LEFT JOIN showtimes s ON m.id = s.movie_id
LEFT JOIN bookings b ON s.id = b.showtime_id AND b.booking_status = 'CONFIRMED'
WHERE m.status = 'ACTIVE'
GROUP BY m.id, m.title, m.poster_url
ORDER BY bookings DESC;

-- Theatre Performance View
CREATE OR REPLACE VIEW theatre_performance AS
SELECT 
    t.id,
    t.name,
    t.city,
    COUNT(DISTINCT b.id) as total_bookings,
    SUM(b.total_amount) as revenue
FROM theatres t
LEFT JOIN screens sc ON t.id = sc.theatre_id
LEFT JOIN showtimes s ON sc.id = s.screen_id
LEFT JOIN bookings b ON s.id = b.showtime_id AND b.booking_status = 'CONFIRMED'
WHERE t.status = 'ACTIVE'
GROUP BY t.id, t.name, t.city
ORDER BY revenue DESC;

-- ============================================
-- ✅ INITIALIZATION COMPLETE
-- ============================================
-- Tables Created: 12
-- Indexes Created: 30+
-- Triggers Created: 7
-- Views Created: 3
-- 
-- Next Step: Run sample-data.sql to populate with demo data
-- ============================================
