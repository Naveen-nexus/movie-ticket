package com.moviereserve.service;

import com.moviereserve.model.Movie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class MovieService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Movie> movieRowMapper = new RowMapper<Movie>() {
        @Override
        public Movie mapRow(ResultSet rs, int rowNum) throws SQLException {
            Movie movie = new Movie();
            movie.setId(rs.getLong("id"));
            movie.setTitle(rs.getString("title"));
            movie.setDescription(rs.getString("description"));
            movie.setGenre(rs.getString("genre"));
            movie.setLanguage(rs.getString("language"));
            movie.setDuration(rs.getInt("duration"));
            movie.setRating(rs.getBigDecimal("rating"));
            movie.setReleaseDate(rs.getDate("release_date").toLocalDate());
            movie.setPosterUrl(rs.getString("poster_url"));
            movie.setBannerUrl(rs.getString("banner_url"));
            movie.setCast(rs.getString("movie_cast"));
            movie.setDirector(rs.getString("director"));
            movie.setStatus(rs.getString("status"));
            movie.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            movie.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return movie;
        }
    };

    public List<Movie> getAllMovies() {
        String sql = "SELECT * FROM movies WHERE status = 'ACTIVE' ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, movieRowMapper);
    }

    public Movie getMovieById(Long id) {
        String sql = "SELECT * FROM movies WHERE id = ?";
        List<Movie> movies = jdbcTemplate.query(sql, movieRowMapper, id);
        return movies.isEmpty() ? null : movies.get(0);
    }

    public List<Movie> searchMovies(String query, String genre, String language, String city) {
        StringBuilder sql = new StringBuilder(
            "SELECT DISTINCT m.* FROM movies m " +
            "LEFT JOIN showtimes st ON m.id = st.movie_id " +
            "LEFT JOIN screens sc ON st.screen_id = sc.id " +
            "LEFT JOIN theatres t ON sc.theatre_id = t.id " +
            "WHERE m.status = 'ACTIVE'"
        );

        if (query != null && !query.isEmpty()) {
            sql.append(" AND (LOWER(m.title) LIKE LOWER(?) OR LOWER(m.description) LIKE LOWER(?))");
        }
        if (genre != null && !genre.isEmpty()) {
            sql.append(" AND m.genre = ?");
        }
        if (language != null && !language.isEmpty()) {
            sql.append(" AND m.language = ?");
        }
        if (city != null && !city.isEmpty()) {
            sql.append(" AND t.city = ?");
        }

        sql.append(" ORDER BY m.created_at DESC");

        Object[] params = buildSearchParams(query, genre, language, city);
        return jdbcTemplate.query(sql.toString(), movieRowMapper, params);
    }

    private Object[] buildSearchParams(String query, String genre, String language, String city) {
        java.util.ArrayList<Object> params = new java.util.ArrayList<>();
        if (query != null && !query.isEmpty()) {
            params.add("%" + query + "%");
            params.add("%" + query + "%");
        }
        if (genre != null && !genre.isEmpty()) {
            params.add(genre);
        }
        if (language != null && !language.isEmpty()) {
            params.add(language);
        }
        if (city != null && !city.isEmpty()) {
            params.add(city);
        }
        return params.toArray();
    }

    public Movie createMovie(Movie movie) {
        String sql = "INSERT INTO movies (title, description, genre, language, duration, rating, " +
                    "release_date, poster_url, banner_url, movie_cast, director, status) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE') RETURNING id";
        
        Long id = jdbcTemplate.queryForObject(sql, Long.class,
            movie.getTitle(), movie.getDescription(), movie.getGenre(), movie.getLanguage(),
            movie.getDuration(), movie.getRating(), movie.getReleaseDate(), movie.getPosterUrl(),
            movie.getBannerUrl(), movie.getCast(), movie.getDirector());
        
        movie.setId(id);
        return movie;
    }

    public Movie updateMovie(Long id, Movie movie) {
        String sql = "UPDATE movies SET title = ?, description = ?, genre = ?, language = ?, " +
                    "duration = ?, rating = ?, release_date = ?, poster_url = ?, banner_url = ?, " +
                    "movie_cast = ?, director = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        
        jdbcTemplate.update(sql,
            movie.getTitle(), movie.getDescription(), movie.getGenre(), movie.getLanguage(),
            movie.getDuration(), movie.getRating(), movie.getReleaseDate(), movie.getPosterUrl(),
            movie.getBannerUrl(), movie.getCast(), movie.getDirector(), id);
        
        return getMovieById(id);
    }

    public void deleteMovie(Long id) {
        String sql = "UPDATE movies SET status = 'INACTIVE' WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<String> getGenres() {
        String sql = "SELECT DISTINCT genre FROM movies WHERE status = 'ACTIVE' AND genre IS NOT NULL ORDER BY genre";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    public List<String> getLanguages() {
        String sql = "SELECT DISTINCT language FROM movies WHERE status = 'ACTIVE' AND language IS NOT NULL ORDER BY language";
        return jdbcTemplate.queryForList(sql, String.class);
    }
}
