package com.moviereserve.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.annotation.PostConstruct;

@Configuration
public class DatabaseConfig {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseConfig(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void testConnection() {
        try {
            String result = jdbcTemplate.queryForObject("SELECT version()", String.class);
            System.out.println("✅ Successfully connected to Supabase PostgreSQL!");
            System.out.println("📊 Database version: " + result);
            initializeDatabase();
        } catch (Exception e) {
            System.err.println("❌ Failed to connect to Supabase: " + e.getMessage());
        }
    }

    private void initializeDatabase() {
        try {
            // Create tables if they don't exist
            createTables();
            System.out.println("✅ Database tables initialized successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to initialize tables: " + e.getMessage());
        }
    }

    private void createTables() {
        // Users table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS users (" +
            "id SERIAL PRIMARY KEY, " +
            "email VARCHAR(255) UNIQUE NOT NULL, " +
            "password VARCHAR(255) NOT NULL, " +
            "full_name VARCHAR(255) NOT NULL, " +
            "phone VARCHAR(20), " +
            "role VARCHAR(20) DEFAULT 'USER', " +
            "wallet_balance DECIMAL(10, 2) DEFAULT 0.00, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Movies table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS movies (" +
            "id SERIAL PRIMARY KEY, " +
            "title VARCHAR(255) NOT NULL, " +
            "description TEXT, " +
            "genre VARCHAR(100), " +
            "language VARCHAR(50), " +
            "duration INTEGER, " +
            "rating DECIMAL(2, 1), " +
            "release_date DATE, " +
            "poster_url TEXT, " +
            "banner_url TEXT, " +
            "cast TEXT, " +
            "director VARCHAR(255), " +
            "status VARCHAR(20) DEFAULT 'ACTIVE', " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Theatres table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS theatres (" +
            "id SERIAL PRIMARY KEY, " +
            "name VARCHAR(255) NOT NULL, " +
            "location VARCHAR(255), " +
            "city VARCHAR(100), " +
            "total_screens INTEGER, " +
            "facilities TEXT, " +
            "status VARCHAR(20) DEFAULT 'ACTIVE', " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Screens table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS screens (" +
            "id SERIAL PRIMARY KEY, " +
            "theatre_id INTEGER REFERENCES theatres(id), " +
            "screen_name VARCHAR(100), " +
            "total_seats INTEGER, " +
            "seat_layout JSONB, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Showtimes table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS showtimes (" +
            "id SERIAL PRIMARY KEY, " +
            "movie_id INTEGER REFERENCES movies(id), " +
            "screen_id INTEGER REFERENCES screens(id), " +
            "show_date DATE NOT NULL, " +
            "show_time TIME NOT NULL, " +
            "price DECIMAL(10, 2) NOT NULL, " +
            "available_seats INTEGER, " +
            "status VARCHAR(20) DEFAULT 'ACTIVE', " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Seats table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS seats (" +
            "id SERIAL PRIMARY KEY, " +
            "screen_id INTEGER REFERENCES screens(id), " +
            "seat_number VARCHAR(10) NOT NULL, " +
            "seat_type VARCHAR(20), " +
            "row_number VARCHAR(5), " +
            "column_number INTEGER, " +
            "price_multiplier DECIMAL(3, 2) DEFAULT 1.00, " +
            "UNIQUE(screen_id, seat_number)" +
            ")"
        );

        // Bookings table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS bookings (" +
            "id SERIAL PRIMARY KEY, " +
            "user_id INTEGER REFERENCES users(id), " +
            "showtime_id INTEGER REFERENCES showtimes(id), " +
            "booking_code VARCHAR(50) UNIQUE NOT NULL, " +
            "total_amount DECIMAL(10, 2) NOT NULL, " +
            "payment_status VARCHAR(20) DEFAULT 'PENDING', " +
            "payment_method VARCHAR(50), " +
            "booking_status VARCHAR(20) DEFAULT 'CONFIRMED', " +
            "qr_code TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Booking Seats table (junction table)
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS booking_seats (" +
            "id SERIAL PRIMARY KEY, " +
            "booking_id INTEGER REFERENCES bookings(id), " +
            "seat_id INTEGER REFERENCES seats(id), " +
            "seat_number VARCHAR(10), " +
            "price DECIMAL(10, 2)" +
            ")"
        );

        // Transactions table (wallet and payment history)
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS transactions (" +
            "id SERIAL PRIMARY KEY, " +
            "user_id INTEGER REFERENCES users(id), " +
            "booking_id INTEGER REFERENCES bookings(id), " +
            "transaction_type VARCHAR(20), " +
            "amount DECIMAL(10, 2), " +
            "status VARCHAR(20), " +
            "description TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Reviews table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS reviews (" +
            "id SERIAL PRIMARY KEY, " +
            "user_id INTEGER REFERENCES users(id), " +
            "movie_id INTEGER REFERENCES movies(id), " +
            "rating INTEGER CHECK (rating >= 1 AND rating <= 5), " +
            "comment TEXT, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
            "UNIQUE(user_id, movie_id)" +
            ")"
        );

        // Notifications table
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS notifications (" +
            "id SERIAL PRIMARY KEY, " +
            "user_id INTEGER REFERENCES users(id), " +
            "title VARCHAR(255), " +
            "message TEXT, " +
            "type VARCHAR(50), " +
            "is_read BOOLEAN DEFAULT FALSE, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );

        // Settings table (for theme preferences)
        jdbcTemplate.execute(
            "CREATE TABLE IF NOT EXISTS user_settings (" +
            "id SERIAL PRIMARY KEY, " +
            "user_id INTEGER REFERENCES users(id) UNIQUE, " +
            "theme VARCHAR(20) DEFAULT 'dark', " +
            "notifications_enabled BOOLEAN DEFAULT TRUE, " +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
            ")"
        );
    }
}
