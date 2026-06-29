package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.MasterHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterHeaderRepository extends JpaRepository<MasterHeader, Long> {
    Optional<MasterHeader> findByDropdownName(String dropdownName);
    Optional<MasterHeader> findByDropdownNameIgnoreCase(String dropdownName);
    Page<MasterHeader> findByDropdownNameContainingIgnoreCase(String dropdownName, Pageable pageable);
    Page<MasterHeader> findByStatus(String status, Pageable pageable);
    Page<MasterHeader> findByDropdownNameContainingIgnoreCaseAndStatus(String dropdownName, String status, Pageable pageable);
}
