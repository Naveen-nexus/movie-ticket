package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    private Long id;
    private Long showtimeId;
    private String seatNumber;
    private String seatType;
    private String rowNumber;
    private String columnNumber;
    private String status;
    private BigDecimal price;
    private Boolean isBooked;
}
