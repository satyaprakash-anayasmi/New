package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStatus(String status);
    List<Document> findByUploaderId(Long uploaderId);
    Optional<Document> findByChecksum(String checksum);
}
