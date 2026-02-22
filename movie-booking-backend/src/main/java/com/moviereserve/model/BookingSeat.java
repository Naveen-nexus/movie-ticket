package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeat {
    private Long id;
    private Long bookingId;
    private Long seatId;
    private String seatNumber;
    private BigDecimal price;
}
