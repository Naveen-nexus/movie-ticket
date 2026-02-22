package com.moviereserve.controller;

import com.moviereserve.model.Movie;
import com.moviereserve.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        Movie movie = movieService.getMovieById(id);
        if (movie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String city) {
        
        List<Movie> movies = movieService.searchMovies(query, genre, language, city);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getGenres() {
        return ResponseEntity.ok(movieService.getGenres());
    }

    @GetMapping("/languages")
    public ResponseEntity<List<String>> getLanguages() {
        return ResponseEntity.ok(movieService.getLanguages());
    }
}
