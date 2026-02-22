package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer duration;
    private BigDecimal rating;
    private LocalDate releaseDate;
    private String posterUrl;
    private String bannerUrl;
    private String cast;
    private String director;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
