package com.moviereserve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("service", "Movie Booking System API");
        health.put("version", "1.0.0");

        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("database", "Connected");
        } catch (Exception e) {
            health.put("database", "Disconnected");
        }

        return ResponseEntity.ok(health);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("application", "Movie Ticket Reservation System");
        info.put("description", "A modern movie booking platform");
        info.put("version", "1.0.0");
        info.put("endpoints", Map.of(
            "auth", "/api/auth/*",
            "movies", "/api/movies/*",
            "theatres", "/api/theatres/*",
            "showtimes", "/api/showtimes/*",
            "bookings", "/api/bookings/*",
            "admin", "/api/admin/*"
        ));

        return ResponseEntity.ok(info);
    }
}
