package com.example.documentmanagement.service;

import com.example.documentmanagement.entity.MasterHeader;
import com.example.documentmanagement.entity.MasterDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MasterService {
    Page<MasterHeader> getMasterHeaders(String search, String status, Pageable pageable);

    MasterHeader createMasterHeader(MasterHeader header);

    MasterHeader updateMasterHeader(Long id, MasterHeader header);

    void softDeleteMasterHeader(Long id);

    void restoreMasterHeader(Long id);

    void permanentDeleteMasterHeader(Long id);

    Page<MasterDetail> getMasterDetails(Long headerId, String search, String status, Pageable pageable);

    MasterDetail createMasterDetail(Long headerId, MasterDetail detail);

    MasterDetail updateMasterDetail(Long id, MasterDetail detail);

    void softDeleteMasterDetail(Long id);

    void restoreMasterDetail(Long id);
    void permanentDeleteMasterDetail(Long id);

    // Auto-create
    MasterDetail autoCreateMasterData(String dropdownName, String value, Long parentId);

    List<MasterDetail> getActiveDetailsByDropdownName(String dropdownName);

    List<MasterDetail> getActiveDetailsByDropdownNameAndParentId(String dropdownName, Long parentId);

    void autoCreateGeographicalHierarchy(
            String country,
            String zone,
            String state,
            String district,
            String block,
            String town,
            String village);
}
