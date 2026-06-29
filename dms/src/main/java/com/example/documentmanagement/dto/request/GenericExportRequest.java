package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class GenericExportRequest {
    
    @NotEmpty(message = "File name is required")
    private String fileName;
    
    @NotEmpty(message = "Sheet name is required")
    private String sheetName;
    
    @NotEmpty(message = "Headers are required")
    private List<String> headers;
    
    @NotNull(message = "Data cannot be null")
    private List<List<Object>> data;
}
