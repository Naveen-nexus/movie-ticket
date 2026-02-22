package com.moviereserve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MovieBookingApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieBookingApplication.class, args);
        System.out.println("\n🎬 Movie Booking System is running on http://localhost:8080");
        System.out.println("📚 API Documentation: http://localhost:8080/api/health\n");
    }
}
