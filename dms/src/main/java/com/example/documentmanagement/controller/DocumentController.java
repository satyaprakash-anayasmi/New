package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.dto.response.DocumentResponse;
import com.example.documentmanagement.service.DocumentService;
import com.example.documentmanagement.util.MessageConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Paths;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@Tag(name = "Document Management", description = "Endpoints for managing documents")
@SecurityRequirement(name = "bearerAuth")
public class DocumentController {

    private final DocumentService documentService;
    private final MessageSource messageSource;

    public DocumentController(DocumentService documentService, MessageSource messageSource) {
        this.documentService = documentService;
        this.messageSource = messageSource;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('UPLOADER', 'ADMIN')")
    @Operation(summary = "Upload a new document")
    public ResponseEntity<ApiResponse<DocumentResponse>> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {

        try {
            DocumentResponse response = documentService.uploadDocument(file, title);
            String successMessage = messageSource.getMessage(MessageConstants.DOCUMENT_UPLOAD_SUCCESS, null,
                    "Uploaded successfully", LocaleContextHolder.getLocale());
            return ResponseEntity.ok(ApiResponse.success(successMessage, response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('UPLOADER', 'REVIEWER', 'ADMIN')")
    @Operation(summary = "Get document metadata by ID")
    public ResponseEntity<ApiResponse<DocumentResponse>> getDocument(@PathVariable Long id) {
        String successMessage = messageSource.getMessage(MessageConstants.DOCUMENT_RETRIEVED_SUCCESS, null,
                "Document retrieved successfully", LocaleContextHolder.getLocale());
        return ResponseEntity.ok(ApiResponse.success(successMessage, documentService.getDocumentById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('UPLOADER', 'REVIEWER', 'ADMIN')")
    @Operation(summary = "Get all documents")
    public ResponseEntity<ApiResponse<List<DocumentResponse>>> getAllDocuments() {
        String successMessage = messageSource.getMessage(MessageConstants.DOCUMENTS_RETRIEVED_SUCCESS, null,
                "Documents retrieved successfully", LocaleContextHolder.getLocale());
        return ResponseEntity.ok(ApiResponse.success(successMessage, documentService.getAllDocuments()));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('UPLOADER', 'REVIEWER', 'ADMIN')")
    @Operation(summary = "Download or stream a document")
    public ResponseEntity<org.springframework.core.io.Resource> downloadDocument(@PathVariable Long id) {
        org.springframework.core.io.Resource resource = documentService.downloadDocument(id);
        String contentType = "application/octet-stream";
        try {
            contentType = Files.probeContentType(Paths.get(resource.getURI()));
        } catch (Exception ex) {
            // Ignored, defaults to application/octet-stream
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
