package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.request.GenericExportRequest;
import com.example.documentmanagement.service.ExcelExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.documentmanagement.exception.BusinessException;
import com.example.documentmanagement.service.ExportDataProvider;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@Tag(name = "Export Module", description = "Endpoints for generic data export")
@RequiredArgsConstructor
public class ExportController {

    private final ExcelExportService excelExportService;
    private final List<ExportDataProvider> exportProviders;

    @PostMapping("/excel/{module}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DEALER')")
    @Operation(summary = "Export generic data to Excel")
    public ResponseEntity<byte[]> exportToExcel(@PathVariable String module, @RequestBody Map<String, Object> filters) {
        
        ExportDataProvider provider = exportProviders.stream()
                .filter(p -> p.getModule().equalsIgnoreCase(module))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Export module not found: " + module));

        GenericExportRequest request = provider.getExportData(filters);
        byte[] excelContent = excelExportService.generateExcel(request);

        String fileName = request.getFileName();
        if (fileName == null || fileName.isEmpty()) {
            fileName = "export";
        }
        if (!fileName.endsWith(".xlsx")) {
            fileName += ".xlsx";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelContent);
    }
}
