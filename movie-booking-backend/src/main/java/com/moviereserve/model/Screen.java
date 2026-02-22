package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Screen {
    private Long id;
    private Long theatreId;
    private String screenName;
    private Integer totalSeats;
    private String seatLayout;
    private LocalDateTime createdAt;
}
