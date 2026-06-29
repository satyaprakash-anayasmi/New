package com.example.documentmanagement.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MasterAutoCreateRequest {
    private String dropdownName;
    private String value;
    private Long parentId;
}
