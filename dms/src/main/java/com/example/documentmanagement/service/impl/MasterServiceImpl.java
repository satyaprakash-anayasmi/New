package com.example.documentmanagement.service.impl;

import com.example.documentmanagement.entity.MasterHeader;
import com.example.documentmanagement.entity.MasterDetail;
import com.example.documentmanagement.repository.MasterHeaderRepository;
import com.example.documentmanagement.repository.MasterDetailRepository;
import com.example.documentmanagement.service.MasterService;
import com.example.documentmanagement.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterServiceImpl implements MasterService {

    private final MasterHeaderRepository headerRepository;
    private final MasterDetailRepository detailRepository;

    @Override
    public Page<MasterHeader> getMasterHeaders(String search, String status, Pageable pageable) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasStatus = status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status);

        if (hasSearch && hasStatus) {
            return headerRepository.findByDropdownNameContainingIgnoreCaseAndStatus(search, status.toUpperCase(),
                    pageable);
        } else if (hasSearch) {
            return headerRepository.findByDropdownNameContainingIgnoreCase(search, pageable);
        } else if (hasStatus) {
            return headerRepository.findByStatus(status.toUpperCase(), pageable);
        } else {
            return headerRepository.findAll(pageable);
        }
    }

    @Override
    @Transactional
    public MasterHeader createMasterHeader(MasterHeader header) {
        String name = header.getDropdownName().toUpperCase().trim();
        java.util.Optional<MasterHeader> existing = headerRepository.findByDropdownName(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        header.setDropdownName(name);
        header.setStatus("ACTIVE");
        return headerRepository.save(header);
    }

    @Override
    @Transactional
    public MasterHeader updateMasterHeader(Long id, MasterHeader header) {
        MasterHeader existing = headerRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master header not found"));
        existing.setDropdownName(header.getDropdownName());
        if (header.getStatus() != null) {
            existing.setStatus(header.getStatus().toUpperCase());
        }
        return headerRepository.save(existing);
    }

    @Override
    @Transactional
    public void softDeleteMasterHeader(Long id) {
        MasterHeader existing = headerRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master header not found"));
        existing.setStatus("INACTIVE");
        headerRepository.save(existing);
    }

    @Override
    @Transactional
    public void restoreMasterHeader(Long id) {
        MasterHeader existing = headerRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master header not found"));
        existing.setStatus("ACTIVE");
        headerRepository.save(existing);
    }

    @Override
    @Transactional
    public void permanentDeleteMasterHeader(Long id) {
        MasterHeader existing = headerRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master header not found"));
        headerRepository.delete(existing);
    }

    @Override
    public Page<MasterDetail> getMasterDetails(Long headerId, String search, String status, Pageable pageable) {
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasStatus = status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status);

        if (hasSearch && hasStatus) {
            return detailRepository.findByMasterHeader_IdAndDisplayNameContainingIgnoreCaseAndStatus(headerId, search,
                    status.toUpperCase(), pageable);
        } else if (hasSearch) {
            return detailRepository.findByMasterHeader_IdAndDisplayNameContainingIgnoreCase(headerId, search, pageable);
        } else if (hasStatus) {
            return detailRepository.findByMasterHeader_IdAndStatus(headerId, status.toUpperCase(), pageable);
        } else {
            return detailRepository.findByMasterHeader_Id(headerId, pageable);
        }
    }

    @Override
    @Transactional
    public MasterDetail createMasterDetail(Long headerId, MasterDetail detail) {
        MasterHeader header = headerRepository.findById(headerId)
                .orElseThrow(() -> new BusinessException("Master header not found"));
        detail.setMasterHeader(header);
        detail.setStatus("ACTIVE");

        if (detail.getParent() != null && detail.getParent().getId() != null) {
            MasterDetail parent = detailRepository.findById(detail.getParent().getId())
                    .orElseThrow(() -> new BusinessException("Parent detail not found"));
            detail.setParent(parent);

            // Duplicate validation check
            if (detailRepository.existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParent_Id(headerId, detail.getDisplayName().trim(), parent.getId())) {
                throw new BusinessException("A value named '" + detail.getDisplayName().trim() + "' already exists under this parent.");
            }
        } else {
            detail.setParent(null);

            // Duplicate validation check
            if (detailRepository.existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParentIsNull(headerId, detail.getDisplayName().trim())) {
                throw new BusinessException("A root value named '" + detail.getDisplayName().trim() + "' already exists under this category.");
            }
        }

        return detailRepository.save(detail);
    }

    @Override
    @Transactional
    public MasterDetail updateMasterDetail(Long id, MasterDetail detail) {
        MasterDetail existing = detailRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master detail value not found"));
        
        String newName = detail.getDisplayName().trim();
        existing.setDisplayName(newName);

        if (detail.getParent() != null && detail.getParent().getId() != null) {
            MasterDetail parent = detailRepository.findById(detail.getParent().getId())
                    .orElseThrow(() -> new BusinessException("Parent detail not found"));
            existing.setParent(parent);

            // Duplicate validation check (excluding self)
            boolean exists = detailRepository.existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParent_Id(existing.getMasterHeader().getId(), newName, parent.getId());
            if (exists && !existing.getId().equals(detail.getId()) && !existing.getDisplayName().equalsIgnoreCase(newName)) {
                throw new BusinessException("A value named '" + newName + "' already exists under this parent.");
            }
        } else if (detail.getParent() == null) {
            existing.setParent(null); // allow removing parent

            // Duplicate validation check (excluding self)
            boolean exists = detailRepository.existsByMasterHeader_IdAndDisplayNameIgnoreCaseAndParentIsNull(existing.getMasterHeader().getId(), newName);
            if (exists && !existing.getId().equals(detail.getId()) && !existing.getDisplayName().equalsIgnoreCase(newName)) {
                throw new BusinessException("A root value named '" + newName + "' already exists under this category.");
            }
        }

        if (detail.getStatus() != null) {
            existing.setStatus(detail.getStatus().toUpperCase());
        }
        return detailRepository.save(existing);
    }

    @Override
    @Transactional
    public void softDeleteMasterDetail(Long id) {
        MasterDetail existing = detailRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master detail value not found"));
        existing.setStatus("INACTIVE");
        detailRepository.save(existing);
    }

    @Override
    @Transactional
    public void restoreMasterDetail(Long id) {
        MasterDetail existing = detailRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master detail value not found"));
        existing.setStatus("ACTIVE");
        detailRepository.save(existing);
    }

    @Override
    @Transactional
    public void permanentDeleteMasterDetail(Long id) {
        MasterDetail existing = detailRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Master detail value not found"));
        detailRepository.delete(existing);
    }

    @Override
    public List<MasterDetail> getActiveDetailsByDropdownName(String dropdownName) {
        return detailRepository.findByMasterHeader_DropdownNameAndStatus(dropdownName.toUpperCase(), "ACTIVE");
    }

    @Override
    public List<MasterDetail> getActiveDetailsByDropdownNameAndParentId(String dropdownName, Long parentId) {
        return detailRepository.findByMasterHeader_DropdownNameAndParent_IdAndStatus(dropdownName.toUpperCase(),
                parentId, "ACTIVE");
    }

    @Override
    @Transactional
    public MasterDetail autoCreateMasterData(String dropdownName, String value, Long parentId) {
        MasterHeader header = ensureHeader(dropdownName);
        MasterDetail parent = null;
        if (parentId != null) {
            parent = detailRepository.findById(parentId).orElse(null);
        }
        return resolveOrCreateDetail(header, value, parent);
    }

    @Override
    @Transactional
    public void autoCreateGeographicalHierarchy(
            String countryName,
            String zoneName,
            String stateName,
            String districtName,
            String blockName,
            String townName,
            String villageName) {

        // Resolve or create COUNTRY
        MasterHeader countryH = ensureHeader("COUNTRY");
        MasterDetail country = resolveOrCreateDetail(countryH, countryName, null);

        // Resolve or create STATE (under country)
        MasterHeader stateH = ensureHeader("STATE");
        MasterDetail state = resolveOrCreateDetail(stateH, stateName, country);

        // Resolve or create DISTRICT (under state)
        MasterHeader districtH = ensureHeader("DISTRICT");
        MasterDetail district = resolveOrCreateDetail(districtH, districtName, state);

        // Resolve or create SUB_DISTRICT (under district, using townName)
        MasterHeader subDistrictH = ensureHeader("SUB_DISTRICT");
        MasterDetail subDistrict = resolveOrCreateDetail(subDistrictH, townName, district);

        // Resolve or create BLOCK (under sub-district)
        MasterHeader blockH = ensureHeader("BLOCK");
        MasterDetail block = resolveOrCreateDetail(blockH, blockName, subDistrict);

        // Resolve or create VILLAGE (under block)
        MasterHeader villageH = ensureHeader("VILLAGE");
        resolveOrCreateDetail(villageH, villageName, block);
    }

    private MasterHeader ensureHeader(String dropdownName) {
        String name = dropdownName.toUpperCase().trim();
        return headerRepository.findByDropdownName(name)
                .orElseGet(() -> {
                    MasterHeader h = new MasterHeader();
                    h.setDropdownName(name);
                    h.setStatus("ACTIVE");
                    return headerRepository.save(h);
                });
    }

    private MasterDetail resolveOrCreateDetail(MasterHeader header, String name, MasterDetail parent) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }
        String cleanName = name.trim();
        
        java.util.Optional<MasterDetail> existing;
        if (parent != null) {
            existing = detailRepository.findByMasterHeader_IdAndDisplayNameIgnoreCaseAndParent_Id(
                    header.getId(), cleanName, parent.getId());
        } else {
            existing = detailRepository.findByMasterHeader_IdAndDisplayNameIgnoreCaseAndParentIsNull(
                    header.getId(), cleanName);
        }

        if (existing.isPresent()) {
            return existing.get();
        }

        // Create new detail
        MasterDetail detail = new MasterDetail();
        detail.setMasterHeader(header);
        detail.setDisplayName(cleanName);
        detail.setParent(parent);
        detail.setStatus("ACTIVE");
        return detailRepository.save(detail);
    }
}
