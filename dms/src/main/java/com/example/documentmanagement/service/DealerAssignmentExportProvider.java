package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.request.GenericExportRequest;
import com.example.documentmanagement.entity.DistributionAssignment;
import com.example.documentmanagement.repository.DistributionAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealerAssignmentExportProvider implements ExportDataProvider {

    private final DistributionAssignmentRepository repository;

    @Override
    public String getModule() {
        return "dealer-assignments";
    }

    @Override
    public GenericExportRequest getExportData(Map<String, Object> filters) {
        String searchTerm = getFilterValue(filters, "searchTerm");
        String dealerName = getFilterValue(filters, "dealerName");
        String area = getFilterValue(filters, "area");
        String productName = getFilterValue(filters, "productName");
        
        List<DistributionAssignment> assignments = repository.exportAssignments(
                searchTerm, dealerName, area, productName);

        List<String> headers = Arrays.asList(
                "Dealer", "State", "District", "Block", "Pin Code", "Assigned Count", "Assigned Names", "Status", "Date"
        );

        List<List<Object>> data = assignments.stream().map(a -> {
            List<Object> row = new ArrayList<>();
            String rawUsername = a.getDealer() != null && a.getDealer().getUser() != null ? a.getDealer().getUser().getUsername() : "";
            row.add(formatName(rawUsername));
            row.add(a.getState() != null ? a.getState() : "");
            row.add(a.getDistrict() != null ? a.getDistrict() : "");
            row.add(a.getBlock() != null ? a.getBlock() : "");
            row.add(a.getPinCode() != null ? a.getPinCode() : "");
            
            int assignedCount = a.getAssignedUsers() != null ? a.getAssignedUsers().size() : 0;
            String assignedNames = "-";
            if (assignedCount > 0) {
                assignedNames = a.getAssignedUsers().stream()
                        .map(u -> u.getFullName() != null && !u.getFullName().isEmpty() ? u.getFullName() : u.getUsername())
                        .map(this::formatName)
                        .collect(Collectors.joining(", "));
            }
            row.add(assignedCount);
            row.add(assignedNames);
            
            row.add(a.isActive() ? "ACTIVE" : "INACTIVE");
            row.add(a.getCreatedAt() != null ? a.getCreatedAt().toLocalDate().toString() : "");
            return row;
        }).collect(Collectors.toList());

        GenericExportRequest request = new GenericExportRequest();
        request.setFileName("Dealer_Assignments");
        request.setSheetName("Assignments");
        request.setHeaders(headers);
        request.setData(data);

        return request;
    }

    private String getFilterValue(Map<String, Object> filters, String key) {
        if (filters == null || !filters.containsKey(key) || filters.get(key) == null) {
            return "";
        }
        return filters.get(key).toString();
    }

    private String formatName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "";
        }
        String[] words = name.split("_");
        StringBuilder formatted = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                formatted.append(Character.toUpperCase(word.charAt(0)))
                         .append(word.substring(1).toLowerCase())
                         .append(" ");
            }
        }
        return formatted.toString().trim();
    }
}
