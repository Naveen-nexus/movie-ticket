package com.moviereserve.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Theatre {
    private Long id;
    private String name;
    private String location;
    private String city;
    private Integer totalScreens;
    private String facilities;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
