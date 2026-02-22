package com.moviereserve.service;

import com.moviereserve.model.Theatre;
import com.moviereserve.model.Screen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class TheatreService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Theatre> theatreRowMapper = (rs, rowNum) -> {
        Theatre theatre = new Theatre();
        theatre.setId(rs.getLong("id"));
        theatre.setName(rs.getString("name"));
        theatre.setLocation(rs.getString("location"));
        theatre.setCity(rs.getString("city"));
        theatre.setTotalScreens(rs.getInt("total_screens"));
        theatre.setFacilities(rs.getString("facilities"));
        theatre.setStatus(rs.getString("status"));
        theatre.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        theatre.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return theatre;
    };

    private final RowMapper<Screen> screenRowMapper = (rs, rowNum) -> {
        Screen screen = new Screen();
        screen.setId(rs.getLong("id"));
        screen.setTheatreId(rs.getLong("theatre_id"));
        screen.setScreenName(rs.getString("screen_name"));
        screen.setTotalSeats(rs.getInt("total_seats"));
        screen.setSeatLayout(rs.getString("seat_layout"));
        screen.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return screen;
    };

    public List<Theatre> getAllTheatres() {
        String sql = "SELECT * FROM theatres WHERE status = 'ACTIVE' ORDER BY name";
        return jdbcTemplate.query(sql, theatreRowMapper);
    }

    public Theatre getTheatreById(Long id) {
        String sql = "SELECT * FROM theatres WHERE id = ?";
        List<Theatre> theatres = jdbcTemplate.query(sql, theatreRowMapper, id);
        return theatres.isEmpty() ? null : theatres.get(0);
    }

    public List<Theatre> getTheatresByCity(String city) {
        String sql = "SELECT * FROM theatres WHERE city = ? AND status = 'ACTIVE' ORDER BY name";
        return jdbcTemplate.query(sql, theatreRowMapper, city);
    }

    public Theatre createTheatre(Theatre theatre) {
        String sql = "INSERT INTO theatres (name, location, city, total_screens, facilities, status) " +
                    "VALUES (?, ?, ?, ?, ?, 'ACTIVE') RETURNING id";
        
        Long id = jdbcTemplate.queryForObject(sql, Long.class,
            theatre.getName(), theatre.getLocation(), theatre.getCity(),
            theatre.getTotalScreens(), theatre.getFacilities());
        
        theatre.setId(id);
        return theatre;
    }

    public Theatre updateTheatre(Long id, Theatre theatre) {
        String sql = "UPDATE theatres SET name = ?, location = ?, city = ?, total_screens = ?, " +
                    "facilities = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        
        jdbcTemplate.update(sql,
            theatre.getName(), theatre.getLocation(), theatre.getCity(),
            theatre.getTotalScreens(), theatre.getFacilities(), id);
        
        return getTheatreById(id);
    }

    public void deleteTheatre(Long id) {
        String sql = "UPDATE theatres SET status = 'INACTIVE' WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public List<Screen> getScreensByTheatre(Long theatreId) {
        String sql = "SELECT * FROM screens WHERE theatre_id = ?";
        return jdbcTemplate.query(sql, screenRowMapper, theatreId);
    }

    public Screen createScreen(Screen screen) {
        String sql = "INSERT INTO screens (theatre_id, screen_name, total_seats, seat_layout) " +
                    "VALUES (?, ?, ?, ?::jsonb) RETURNING id";
        
        Long id = jdbcTemplate.queryForObject(sql, Long.class,
            screen.getTheatreId(), screen.getScreenName(),
            screen.getTotalSeats(), screen.getSeatLayout());
        
        screen.setId(id);
        return screen;
    }

    public List<String> getCities() {
        String sql = "SELECT DISTINCT city FROM theatres WHERE status = 'ACTIVE' AND city IS NOT NULL ORDER BY city";
        return jdbcTemplate.queryForList(sql, String.class);
    }
}
