package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.entity.MasterHeader;
import com.example.documentmanagement.entity.MasterDetail;
import com.example.documentmanagement.service.MasterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.documentmanagement.util.MessageConstants;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Master Dropdown Management", description = "Endpoints for dynamic master config and dynamic dropdowns")
public class MasterController {

    private final MasterService masterService;

    @GetMapping("/api/auth/masters/values")
    @Operation(summary = "Public dropdown lookup by category (e.g. GENDER, STATE, DISTRICT). Can be filtered by parentId for cascading.")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getDropdownValues(
            @RequestParam String dropdownName,
            @RequestParam(required = false) Long parentId) {

        List<MasterDetail> details;
        if (parentId != null) {
            details = masterService.getActiveDetailsByDropdownNameAndParentId(dropdownName, parentId);
        } else {
            details = masterService.getActiveDetailsByDropdownName(dropdownName);
        }

        // Return id, name, and parentId so frontend cascade engine can filter
        // child dropdowns by parent ID. Use LinkedHashMap to support null parentId values.
        List<java.util.Map<String, Object>> values = details.stream()
                .map(d -> {
                    java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", d.getId());
                    m.put("name", d.getDisplayName());
                    m.put("parentId", d.getParent() != null ? d.getParent().getId() : null);
                    return m;
                })
                .toList();

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.DROPDOWN_VALUES_RETRIEVED, values));
    }

    @PostMapping("/api/auth/masters/auto-create")
    @Operation(summary = "Auto-create a master dropdown value (accessible to authenticated users)")
    public ResponseEntity<ApiResponse<MasterDetail>> autoCreateMasterData(
            @RequestBody com.example.documentmanagement.dto.request.MasterAutoCreateRequest request) {
        MasterDetail created = masterService.autoCreateMasterData(request.getDropdownName(), request.getValue(), request.getParentId());
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_CREATED, created));
    }

    // ── Admin Headers CRUD ────────────────────────────────────────────────────

    @GetMapping("/api/admin/masters/headers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search master headers config")
    public ResponseEntity<ApiResponse<Page<MasterHeader>>> getMasterHeaders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADERS_RETRIEVED,
                masterService.getMasterHeaders(search, status, pageable)));
    }

    @PostMapping("/api/admin/masters/headers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create master dropdown config header")
    public ResponseEntity<ApiResponse<MasterHeader>> createMasterHeader(@RequestBody MasterHeader header) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADER_CREATED,
                masterService.createMasterHeader(header)));
    }

    @PutMapping("/api/admin/masters/headers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update master dropdown config header")
    public ResponseEntity<ApiResponse<MasterHeader>> updateMasterHeader(@PathVariable Long id,
            @RequestBody MasterHeader header) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADER_UPDATED,
                masterService.updateMasterHeader(id, header)));
    }

    @DeleteMapping("/api/admin/masters/headers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate/Soft delete master header config")
    public ResponseEntity<ApiResponse<Void>> softDeleteMasterHeader(@PathVariable Long id) {
        masterService.softDeleteMasterHeader(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADER_DEACTIVATED));
    }

    @PutMapping("/api/admin/masters/headers/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Restore/Reactivate master header config")
    public ResponseEntity<ApiResponse<Void>> restoreMasterHeader(@PathVariable Long id) {
        masterService.restoreMasterHeader(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADER_RESTORED));
    }

    @DeleteMapping("/api/admin/masters/headers/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permanently delete master header config")
    public ResponseEntity<ApiResponse<Void>> permanentDeleteMasterHeader(@PathVariable Long id) {
        masterService.permanentDeleteMasterHeader(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_HEADER_DELETED));
    }

    // ── Admin Details CRUD ────────────────────────────────────────────────────

    @GetMapping("/api/admin/masters/headers/{headerId}/details")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search dropdown detail values for a config category")
    public ResponseEntity<ApiResponse<Page<MasterDetail>>> getMasterDetails(
            @PathVariable Long headerId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAILS_RETRIEVED,
                masterService.getMasterDetails(headerId, search, status, pageable)));
    }

    @PostMapping("/api/admin/masters/headers/{headerId}/details")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add value under master category")
    public ResponseEntity<ApiResponse<MasterDetail>> createMasterDetail(@PathVariable Long headerId,
            @RequestBody MasterDetail detail) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_CREATED,
                masterService.createMasterDetail(headerId, detail)));
    }

    @PutMapping("/api/admin/masters/details/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update master dropdown value")
    public ResponseEntity<ApiResponse<MasterDetail>> updateMasterDetail(@PathVariable Long id,
            @RequestBody MasterDetail detail) {
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_UPDATED,
                masterService.updateMasterDetail(id, detail)));
    }

    @DeleteMapping("/api/admin/masters/details/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate/Soft delete master dropdown value")
    public ResponseEntity<ApiResponse<Void>> softDeleteMasterDetail(@PathVariable Long id) {
        masterService.softDeleteMasterDetail(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_DEACTIVATED));
    }

    @PutMapping("/api/admin/masters/details/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Restore/Reactivate master dropdown value")
    public ResponseEntity<ApiResponse<Void>> restoreMasterDetail(@PathVariable Long id) {
        masterService.restoreMasterDetail(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_RESTORED));
    }

    @DeleteMapping("/api/admin/masters/details/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permanently delete master dropdown value")
    public ResponseEntity<ApiResponse<Void>> permanentDeleteMasterDetail(@PathVariable Long id) {
        masterService.permanentDeleteMasterDetail(id);
        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.MASTER_DETAIL_DELETED));
    }
}
