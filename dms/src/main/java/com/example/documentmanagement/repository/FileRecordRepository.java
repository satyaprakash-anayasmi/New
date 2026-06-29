package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.FileRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRecordRepository extends JpaRepository<FileRecord, Long> {
    Optional<FileRecord> findByStoredFileName(String storedFileName);
    boolean existsByOriginalFileNameAndFileSize(String originalFileName, Long fileSize);
}
