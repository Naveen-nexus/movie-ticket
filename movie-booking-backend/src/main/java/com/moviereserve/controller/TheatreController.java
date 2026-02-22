package com.moviereserve.controller;

import com.moviereserve.model.Theatre;
import com.moviereserve.model.Screen;
import com.moviereserve.service.TheatreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@CrossOrigin(origins = "*")
public class TheatreController {

    @Autowired
    private TheatreService theatreService;

    @GetMapping
    public ResponseEntity<List<Theatre>> getAllTheatres() {
        return ResponseEntity.ok(theatreService.getAllTheatres());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTheatreById(@PathVariable Long id) {
        Theatre theatre = theatreService.getTheatreById(id);
        if (theatre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(theatre);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Theatre>> getTheatresByCity(@PathVariable String city) {
        return ResponseEntity.ok(theatreService.getTheatresByCity(city));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCities() {
        return ResponseEntity.ok(theatreService.getCities());
    }

    @GetMapping("/{id}/screens")
    public ResponseEntity<List<Screen>> getScreensByTheatre(@PathVariable Long id) {
        return ResponseEntity.ok(theatreService.getScreensByTheatre(id));
    }
}
