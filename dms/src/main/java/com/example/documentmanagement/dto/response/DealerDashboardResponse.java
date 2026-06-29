package com.example.documentmanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerDashboardResponse {
    private long totalDistributions;
    private long verifiedDistributions;
    private long pendingDistributions;
    private long rejectedDistributions;
    private double successRate;
    private long totalProductsAssigned;
}
