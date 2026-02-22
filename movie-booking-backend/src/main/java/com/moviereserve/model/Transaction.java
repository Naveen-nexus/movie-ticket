package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private Long id;
    private Long userId;
    private Long bookingId;
    private String transactionType;
    private BigDecimal amount;
    private String status;
    private String description;
    private LocalDateTime createdAt;
}
