package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.response.FileRecordDto;
import com.example.documentmanagement.entity.FileRecord;
import com.example.documentmanagement.exception.*;
import com.example.documentmanagement.repository.FileRecordRepository;
import com.example.documentmanagement.util.MessageConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path fileStorageLocation;
    private final FileRecordRepository fileRecordRepository;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
    );

    @Autowired
    public FileStorageService(FileRecordRepository fileRecordRepository) {
        this.fileRecordRepository = fileRecordRepository;
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new StorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileRecordDto storeFile(MultipartFile file, String uploadedBy) {
        validateFile(file);

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
        


        try {
            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }

            String newFileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + newFileName;

            FileRecord record = FileRecord.builder()
                    .originalFileName(originalFileName)
                    .storedFileName(newFileName)
                    .fileUrl(fileUrl)
                    .mimeType(file.getContentType())
                    .fileSize(file.getSize())
                    .status("ACTIVE")
                    .uploadedBy(uploadedBy)
                    .build();

            record = fileRecordRepository.save(record);
            log.info("Stored new file: {}", originalFileName);

            return mapToDto(record);
        } catch (IOException ex) {
            log.error("Failed to store file {}", originalFileName, ex);
            throw new FileUploadException(MessageConstants.Error.UPLOAD_FAILED, ex);
        }
    }

    public FileRecordDto getFile(Long id) {
        FileRecord record = findById(id);
        if ("DELETED".equals(record.getStatus())) {
            throw new FileNotFoundException(MessageConstants.Error.FILE_NOT_FOUND);
        }
        return mapToDto(record);
    }

    public FileRecordDto replaceFile(Long id, MultipartFile newFile, String uploadedBy) {
        FileRecord existingRecord = findById(id);
        
        // Remove old file from disk if we are fully replacing it
        deleteFileFromDisk(existingRecord.getStoredFileName());

        // Upload and replace data
        validateFile(newFile);
        String originalFileName = StringUtils.cleanPath(newFile.getOriginalFilename() != null ? newFile.getOriginalFilename() : "");
        
        try {
            String extension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                extension = originalFileName.substring(i);
            }

            String newFileName = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(newFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            existingRecord.setOriginalFileName(originalFileName);
            existingRecord.setStoredFileName(newFileName);
            existingRecord.setFileUrl("/uploads/" + newFileName);
            existingRecord.setMimeType(newFile.getContentType());
            existingRecord.setFileSize(newFile.getSize());
            existingRecord.setStatus("ACTIVE");
            existingRecord.setUploadedBy(uploadedBy);

            existingRecord = fileRecordRepository.save(existingRecord);
            log.info("Replaced file ID: {}", id);

            return mapToDto(existingRecord);
        } catch (IOException ex) {
            log.error("Failed to replace file ID {}", id, ex);
            throw new FileUploadException(MessageConstants.Error.UPLOAD_FAILED, ex);
        }
    }

    public void softDeleteFile(Long id) {
        FileRecord record = findById(id);
        record.setStatus("DELETED");
        fileRecordRepository.save(record);
        log.info("Soft deleted file ID: {}", id);
    }

    public void recoverFile(Long id) {
        FileRecord record = findById(id);
        if ("ACTIVE".equals(record.getStatus())) {
            return;
        }
        record.setStatus("ACTIVE");
        fileRecordRepository.save(record);
        log.info("Recovered file ID: {}", id);
    }

    public void permanentlyDeleteFile(Long id) {
        FileRecord record = findById(id);
        deleteFileFromDisk(record.getStoredFileName());
        fileRecordRepository.delete(record);
        log.info("Permanently deleted file ID: {}", id);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException(MessageConstants.Error.INVALID_FILE);
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
        if (originalFileName.contains("..")) {
            throw new InvalidFileException(MessageConstants.Error.INVALID_FILE);
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException(MessageConstants.Error.FILE_TOO_LARGE);
        }

        if (file.getContentType() == null || !ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException(MessageConstants.Error.UNSUPPORTED_FORMAT);
        }
    }

    private void deleteFileFromDisk(String storedFileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storedFileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.error("Failed to delete file from disk: {}", storedFileName, ex);
        }
    }

    private FileRecord findById(Long id) {
        return fileRecordRepository.findById(id)
                .orElseThrow(() -> new FileNotFoundException(MessageConstants.Error.FILE_NOT_FOUND));
    }

    private FileRecordDto mapToDto(FileRecord record) {
        return FileRecordDto.builder()
                .id(record.getId())
                .originalFileName(record.getOriginalFileName())
                .fileUrl(record.getFileUrl())
                .mimeType(record.getMimeType())
                .fileSize(record.getFileSize())
                .status(record.getStatus())
                .uploadedBy(record.getUploadedBy())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
