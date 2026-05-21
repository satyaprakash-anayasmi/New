package com.example.documentmanagement.mapper;

import com.example.documentmanagement.dto.response.DocumentResponse;
import com.example.documentmanagement.entity.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public DocumentResponse toResponse(Document document) {
        if (document == null) {
            return null;
        }

        return DocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .fileSize(document.getFileSize())
                .fileType(document.getFileType())
                .status(document.getStatus() != null ? document.getStatus().name() : null)
                .uploaderUsername(document.getUploader() != null ? document.getUploader().getUsername() : null)
                .createdAt(document.getCreatedAt())
                .updatedAt(document.getUpdatedAt())
                .build();
    }
}
