package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private Long id;
    private Long userId;
    private Long showtimeId;
    private String bookingCode;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String paymentMethod;
    private String bookingStatus;
    private String qrCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for response
    private String movieTitle;
    private String theatreName;
    private String showDate;
    private String showTime;
    private List<String> seatNumbers;
    private String userEmail;
}
