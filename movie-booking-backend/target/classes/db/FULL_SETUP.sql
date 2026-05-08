-- ============================================
-- COMPLETE DATABASE SETUP - Run this SECOND
-- Creates all movies, theatres, screens, showtimes, and seats
-- Run in Supabase SQL Editor after CLEANUP.sql
-- ============================================

-- ============================================
-- PART 0: INSERT DEFAULT USERS
-- Password is "password123" (BCrypt encrypted)
-- ============================================
INSERT INTO users (email, password, full_name, phone, role, wallet_balance) VALUES
('user@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J9nNOJmLLa51WZ45jjMQ7FfRqCW.0q', 'Test User', '1234567890', 'USER', 1000.00),
('admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J9nNOJmLLa51WZ45jjMQ7FfRqCW.0q', 'Admin User', '0987654321', 'ADMIN', 5000.00);

-- ============================================
-- PART 1: INSERT MOVIES WITH REAL TMDB IMAGES
-- ============================================
INSERT INTO movies (title, description, genre, duration, language, release_date, rating, movie_cast, director, poster_url, banner_url, trailer_url, status) VALUES
('Dune: Part Two', 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.', 'Science Fiction, Adventure', 166, 'English', '2024-02-28', 8.3, 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Josh Brolin, Austin Butler', 'Denis Villeneuve', 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', 'https://www.youtube.com/watch?v=Way9Dexny3w', 'ACTIVE'),

('Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 'Drama, History', 180, 'English', '2023-07-19', 8.5, 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.', 'Christopher Nolan', 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 'ACTIVE'),

('The Batman', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city''s hidden corruption.', 'Action, Crime, Drama', 176, 'English', '2022-03-01', 7.8, 'Robert Pattinson, Zoë Kravitz, Jeffrey Wright, Colin Farrell', 'Matt Reeves', 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', 'https://www.youtube.com/watch?v=mqqft2x_Aa4', 'ACTIVE'),

('Spider-Man: No Way Home', 'Peter Parker seeks help from Doctor Strange when his secret identity is revealed, causing problems across the multiverse.', 'Action, Adventure, Science Fiction', 148, 'English', '2021-12-15', 8.1, 'Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon', 'Jon Watts', 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', 'https://www.youtube.com/watch?v=JfVOs4VSpmA', 'ACTIVE'),

('Avengers: Endgame', 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos'' actions and restore balance.', 'Action, Adventure, Drama', 181, 'English', '2019-04-24', 8.4, 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson', 'Anthony Russo, Joe Russo', 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'ACTIVE'),

('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.', 'Action, Science Fiction, Mystery', 148, 'English', '2010-07-15', 8.8, 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy', 'Christopher Nolan', 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'ACTIVE'),

('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.', 'Adventure, Drama, Science Fiction', 169, 'English', '2014-11-05', 8.6, 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine', 'Christopher Nolan', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'https://image.tmdb.org/t/p/original/pbrkL804c8yAv3zBZR4QPEafpAR.jpg', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'ACTIVE'),

('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest tests.', 'Drama, Action, Crime, Thriller', 152, 'English', '2008-07-16', 9.0, 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine', 'Christopher Nolan', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg', 'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'ACTIVE'),

('Joker', 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.', 'Crime, Thriller, Drama', 122, 'English', '2019-10-01', 8.2, 'Joaquin Phoenix, Robert De Niro, Zazie Beetz, Frances Conroy', 'Todd Phillips', 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg', 'https://www.youtube.com/watch?v=zAGVQLHvwOY', 'ACTIVE'),

('Parasite', 'All unemployed, the Kim family takes peculiar interest in the wealthy Park family.', 'Comedy, Thriller, Drama', 133, 'Korean', '2019-05-30', 8.5, 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik', 'Bong Joon-ho', 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg', 'https://www.youtube.com/watch?v=5xH0HfJHsaY', 'ACTIVE'),

('Tenet', 'Armed with only one word, a protagonist must prevent World War III through time manipulation.', 'Action, Thriller, Science Fiction', 150, 'English', '2020-08-22', 7.3, 'John David Washington, Robert Pattinson, Elizabeth Debicki, Kenneth Branagh', 'Christopher Nolan', 'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg', 'https://image.tmdb.org/t/p/original/wzJRB4MKi3yK138bJyuL9nx47y6.jpg', 'https://www.youtube.com/watch?v=AZGcmvrTX9M', 'ACTIVE'),

('Shang-Chi and the Legend of the Ten Rings', 'Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the Ten Rings organization.', 'Action, Adventure, Fantasy', 132, 'English', '2021-09-01', 7.6, 'Simu Liu, Awkwafina, Tony Leung, Meng''er Zhang', 'Destin Daniel Cretton', 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', 'https://image.tmdb.org/t/p/original/cinER0ESG0eJ49kXlExM0MEWGxW.jpg', 'https://www.youtube.com/watch?v=8YjFbMbfXaQ', 'ACTIVE'),

('Black Panther', 'T''Challa returns home to Wakanda to take his rightful place as king, but faces challenges to the throne.', 'Action, Adventure, Science Fiction', 134, 'English', '2018-02-13', 7.4, 'Chadwick Boseman, Michael B. Jordan, Lupita Nyong''o, Danai Gurira', 'Ryan Coogler', 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', 'https://image.tmdb.org/t/p/original/b6ZJZHUdMEFECvGiDpJjlfUWela.jpg', 'https://www.youtube.com/watch?v=xjDjIWPwcPU', 'ACTIVE'),

('Guardians of the Galaxy Vol. 3', 'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe.', 'Science Fiction, Adventure, Action', 150, 'English', '2023-05-03', 8.0, 'Chris Pratt, Zoe Saldana, Dave Bautista, Karen Gillan, Bradley Cooper', 'James Gunn', 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', 'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg', 'https://www.youtube.com/watch?v=u3V5KDHRQvk', 'ACTIVE'),

('Avatar: The Way of Water', 'Jake Sully and Neytiri have formed a family and are doing everything to stay together. However, they must leave their home.', 'Science Fiction, Adventure, Action', 192, 'English', '2022-12-14', 7.7, 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Kate Winslet', 'James Cameron', 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg', 'https://www.youtube.com/watch?v=d9MyW72ELq0', 'ACTIVE');

-- ============================================
-- PART 2: INSERT THEATRES, SCREENS, AND SHOWTIMES
-- ============================================
DO $$
DECLARE
    theatre1_id BIGINT;
    theatre2_id BIGINT;
    theatre3_id BIGINT;
    screen1_id BIGINT;
    screen2_id BIGINT;
    screen3_id BIGINT;
    screen4_id BIGINT;
    screen5_id BIGINT;
    screen6_id BIGINT;
    screen7_id BIGINT;
    screen8_id BIGINT;
    movie_id_var BIGINT;
    movie_rec RECORD;
BEGIN
    -- ============================================
    -- INSERT THEATRES
    -- ============================================
    INSERT INTO theatres (name, location, city, total_screens, facilities, status) 
    VALUES ('PVR Cinemas Downtown', '123 Main Street', 'New York', 3, 'IMAX, Dolby Atmos, Food Court', 'ACTIVE')
    RETURNING id INTO theatre1_id;
    
    INSERT INTO theatres (name, location, city, total_screens, facilities, status) 
    VALUES ('AMC Multiplex', '456 Hollywood Blvd', 'New York', 3, '4DX, Recliner Seats', 'ACTIVE')
    RETURNING id INTO theatre2_id;
    
    INSERT INTO theatres (name, location, city, total_screens, facilities, status) 
    VALUES ('Cineplex IMAX', '789 Broadway', 'New York', 2, 'Premium Seating, Bar', 'ACTIVE')
    RETURNING id INTO theatre3_id;

    -- ============================================
    -- INSERT SCREENS
    -- ============================================
    -- PVR Cinemas screens
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre1_id, 'Screen 1', 100) RETURNING id INTO screen1_id;
    
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre1_id, 'Screen 2', 80) RETURNING id INTO screen2_id;
    
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre1_id, 'Screen 3', 120) RETURNING id INTO screen3_id;
    
    -- AMC Theatre screens
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre2_id, 'Screen 1', 100) RETURNING id INTO screen4_id;
    
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre2_id, 'Screen 2', 90) RETURNING id INTO screen5_id;
    
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre2_id, 'Screen 3', 110) RETURNING id INTO screen6_id;
    
    -- Cineplex screens
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre3_id, 'Screen 1', 80) RETURNING id INTO screen7_id;
    
    INSERT INTO screens (theatre_id, screen_name, total_seats) 
    VALUES (theatre3_id, 'Screen 2', 100) RETURNING id INTO screen8_id;

    -- ============================================
    -- INSERT SHOWTIMES FOR ALL 15 MOVIES
    -- ============================================
    -- For each movie, create showtimes across different screens and times
    FOR movie_rec IN SELECT id FROM movies ORDER BY id LOOP
        movie_id_var := movie_rec.id;
        
        -- Morning shows (different screens for variety)
        INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, status) VALUES
        (movie_id_var, screen1_id, CURRENT_DATE, '09:00:00', 10.99, 'ACTIVE'),
        (movie_id_var, screen2_id, CURRENT_DATE, '09:30:00', 10.99, 'ACTIVE'),
        (movie_id_var, screen4_id, CURRENT_DATE, '10:00:00', 11.99, 'ACTIVE');
        
        -- Afternoon shows
        INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, status) VALUES
        (movie_id_var, screen1_id, CURRENT_DATE, '13:00:00', 12.99, 'ACTIVE'),
        (movie_id_var, screen3_id, CURRENT_DATE, '14:00:00', 12.99, 'ACTIVE'),
        (movie_id_var, screen5_id, CURRENT_DATE, '15:00:00', 13.99, 'ACTIVE');
        
        -- Evening shows (higher prices)
        INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, status) VALUES
        (movie_id_var, screen1_id, CURRENT_DATE, '18:00:00', 15.99, 'ACTIVE'),
        (movie_id_var, screen2_id, CURRENT_DATE, '19:00:00', 15.99, 'ACTIVE'),
        (movie_id_var, screen6_id, CURRENT_DATE, '20:00:00', 16.99, 'ACTIVE');
        
        -- Night shows
        INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, status) VALUES
        (movie_id_var, screen7_id, CURRENT_DATE, '21:30:00', 14.99, 'ACTIVE'),
        (movie_id_var, screen8_id, CURRENT_DATE, '22:00:00', 14.99, 'ACTIVE');
        
        -- Tomorrow's shows (2 showtimes)
        INSERT INTO showtimes (movie_id, screen_id, show_date, show_time, base_price, status) VALUES
        (movie_id_var, screen1_id, CURRENT_DATE + 1, '10:00:00', 10.99, 'ACTIVE'),
        (movie_id_var, screen1_id, CURRENT_DATE + 1, '18:00:00', 15.99, 'ACTIVE');
    END LOOP;
END $$;

-- ============================================
-- PART 3: CREATE SEATS FOR ALL SHOWTIMES
-- ============================================
DO $$
DECLARE
    showtime_rec RECORD;
    row_char CHAR(1);
    seat_price DECIMAL(10,2);
BEGIN
    -- Loop through all showtimes
    FOR showtime_rec IN SELECT id, base_price FROM showtimes
    LOOP
        -- Create 100 seats (10 rows x 10 columns)
        FOR i IN 1..10 LOOP
            row_char := CHR(64 + i); -- A, B, C, etc.
            FOR j IN 1..10 LOOP
                -- Vary price based on row
                IF i <= 3 THEN
                    seat_price := showtime_rec.base_price * 1.5; -- Premium (first 3 rows)
                ELSE
                    seat_price := showtime_rec.base_price; -- Regular
                END IF;
                
                INSERT INTO seats (showtime_id, seat_number, row_number, column_number, seat_type, status, price)
                VALUES (
                    showtime_rec.id,
                    row_char || j,
                    row_char,
                    j::VARCHAR,
                    CASE WHEN i <= 3 THEN 'PREMIUM' ELSE 'REGULAR' END,
                    'AVAILABLE',
                    seat_price
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;

-- ============================================
-- VERIFY THE DATA
-- ============================================
SELECT 'Movies: ' || COUNT(*) FROM movies;
SELECT 'Theatres: ' || COUNT(*) FROM theatres;
SELECT 'Screens: ' || COUNT(*) FROM screens;
SELECT 'Showtimes: ' || COUNT(*) FROM showtimes;
SELECT 'Seats: ' || COUNT(*) FROM seats;

-- Show sample data
SELECT 
    m.title,
    t.name as theatre,
    t.city,
    s.show_date,
    s.show_time,
    s.base_price,
    COUNT(se.id) as total_seats
FROM showtimes s
JOIN movies m ON s.movie_id = m.id
JOIN screens sc ON s.screen_id = sc.id
JOIN theatres t ON sc.theatre_id = t.id
LEFT JOIN seats se ON s.id = se.showtime_id
WHERE s.show_date = CURRENT_DATE
GROUP BY m.title, t.name, t.city, s.show_date, s.show_time, s.base_price
ORDER BY m.title, s.show_time
LIMIT 30;
