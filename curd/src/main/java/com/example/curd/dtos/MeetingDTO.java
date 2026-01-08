package com.example.curd.dtos;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class MeetingDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime meetingTime;
}