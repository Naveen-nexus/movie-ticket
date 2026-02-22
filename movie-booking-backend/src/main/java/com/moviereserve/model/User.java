package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String role;
    private BigDecimal walletBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
