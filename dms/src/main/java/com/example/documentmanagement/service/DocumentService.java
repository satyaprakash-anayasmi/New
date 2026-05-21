package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.response.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

public interface DocumentService {
    DocumentResponse uploadDocument(MultipartFile file, String title) throws IOException, NoSuchAlgorithmException;

    DocumentResponse getDocumentById(Long id);

    List<DocumentResponse> getAllDocuments();

    org.springframework.core.io.Resource downloadDocument(Long id);
}
