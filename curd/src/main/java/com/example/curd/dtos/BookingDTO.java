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
    private Long studentId; 
}