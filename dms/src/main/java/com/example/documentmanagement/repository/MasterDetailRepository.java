package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.MasterDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterDetailRepository extends JpaRepository<MasterDetail, Long> {
    List<MasterDetail> findByMasterHeader_DropdownNameAndStatus(String dropdownName, String status);

    // Dependent Dropdown
    List<MasterDetail> findByMasterHeader_DropdownNameAndParent_IdAndStatus(String dropdownName, Long parentId,
            String status);

    Page<MasterDetail> findByMasterHeader_Id(Long masterHeaderId, Pageable pageable);

    Page<MasterDetail> findByMasterHeader_IdAndDisplayNameContainingIgnoreCase(Long masterHeaderId, String displayName,
            Pageable pageable);

    Page<MasterDetail> findByMasterHeader_IdAndStatus(Long masterHeaderId, String status, Pageable pageable);

    Page<MasterDetail> findByMasterHeader_IdAndDisplayNameContainingIgnoreCaseAndStatus(Long masterHeaderId,
            String displayName, String status, Pageable pageable);

    // Duplicate check methods for DataInitializer
    boolean existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParent_Id(Long headerId, String displayName, Long parentId);

    boolean existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParentIsNull(Long headerId, String displayName);

    java.util.Optional<MasterDetail> findByMasterHeader_IdAndDisplayNameIgnoreCaseAndParent_Id(Long headerId, String displayName, Long parentId);

    java.util.Optional<MasterDetail> findByMasterHeader_IdAndDisplayNameIgnoreCaseAndParentIsNull(Long headerId, String displayName);
}
