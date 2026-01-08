package com.example.curd.dtos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class BookingDTO {
    private Long id;
    private String bookingReferenceNumber;
    private String customerName;
    private LocalDate validUntil;
    private LocalDateTime createdAt;
    // Avoid including full StudentDTO to prevent circular references, or use a simplified ID
    private Long studentId; 
}