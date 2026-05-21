package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.dto.response.DocumentResponse;
import com.example.documentmanagement.entity.Document;
import com.example.documentmanagement.entity.DocumentStatus;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.mapper.DocumentMapper;
import com.example.documentmanagement.repository.DocumentRepository;
import com.example.documentmanagement.repository.UserRepository;
import com.example.documentmanagement.service.AuditService;
import com.example.documentmanagement.service.DocumentService;
import com.example.documentmanagement.util.MessageConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.documentmanagement.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final DocumentMapper documentMapper;
    private final MessageSource messageSource;

    @Value("${app.file.storage.location}")
    private String uploadDir;

    public DocumentServiceImpl(DocumentRepository documentRepository, UserRepository userRepository,
            AuditService auditService, DocumentMapper documentMapper, MessageSource messageSource) {
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.documentMapper = documentMapper;
        this.messageSource = messageSource;
    }

    @Override
    @Transactional
    public DocumentResponse uploadDocument(MultipartFile file, String title)
            throws IOException, NoSuchAlgorithmException {
        if (file.isEmpty()) {
            String msg = messageSource.getMessage(MessageConstants.ERROR_FILE_EMPTY, null, "File cannot be empty",
                    LocaleContextHolder.getLocale());
            throw new IllegalArgumentException(msg);
        }

        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.write(filePath, file.getBytes());

        String checksum = calculateChecksum(file.getBytes());
        User currentUser = getCurrentUser();

        Document document = Document.builder()
                .title(title)
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .checksum(checksum)
                .status(DocumentStatus.UPLOADED)
                .uploader(currentUser)
                .build();

        Document savedDoc = documentRepository.save(document);
        auditService.logAction("UPLOAD_DOCUMENT", "DOCUMENT", savedDoc.getId(), "Uploaded " + title);

        return documentMapper.toResponse(savedDoc);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> {
                    String msg = messageSource.getMessage(MessageConstants.DOCUMENT_NOT_FOUND, null,
                            "Document not found", LocaleContextHolder.getLocale());
                    return new ResourceNotFoundException(msg);
                });
        return documentMapper.toResponse(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(documentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.core.io.Resource downloadDocument(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> {
                    String msg = messageSource.getMessage(MessageConstants.DOCUMENT_NOT_FOUND, null,
                            "Document not found", LocaleContextHolder.getLocale());
                    return new ResourceNotFoundException(msg);
                });
        try {
            Path filePath = Paths.get(doc.getFilePath());
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Could not read file: " + doc.getFilePath());
            }
        } catch (IOException e) {
            throw new ResourceNotFoundException("Error reading file: " + doc.getFilePath());
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    String msg = messageSource.getMessage(MessageConstants.USER_NOT_FOUND, null, "User not found",
                            LocaleContextHolder.getLocale());
                    return new ResourceNotFoundException(msg);
                });
    }

    private String calculateChecksum(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] encodedhash = digest.digest(data);
        StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
        for (byte b : encodedhash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
