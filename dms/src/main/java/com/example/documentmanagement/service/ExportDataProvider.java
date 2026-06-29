package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.request.GenericExportRequest;

import java.util.Map;

public interface ExportDataProvider {
    String getModule();
    GenericExportRequest getExportData(Map<String, Object> filters);
}
