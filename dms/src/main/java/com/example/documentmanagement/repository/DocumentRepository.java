package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.Document;
import com.example.documentmanagement.entity.DocumentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStatus(DocumentStatus status);

    Page<Document> findByStatusIn(List<DocumentStatus> statuses, Pageable pageable);

    List<Document> findByUploaderId(Long uploaderId);

    Optional<Document> findByChecksum(String checksum);
}
