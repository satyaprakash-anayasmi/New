package com.example.documentmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileRecordDto {
    private Long id;
    private String originalFileName;
    private String fileUrl;
    private String mimeType;
    private Long fileSize;
    private String status;
    private String uploadedBy;
    private LocalDateTime createdAt;
}
