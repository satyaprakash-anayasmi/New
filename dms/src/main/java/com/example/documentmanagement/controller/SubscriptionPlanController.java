package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.entity.SubscriptionPlan;
import com.example.documentmanagement.repository.SubscriptionPlanRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@Tag(name = "Subscription Plans", description = "Endpoints for retrieving membership subscription plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @GetMapping
    @Operation(summary = "Get list of active subscription plans")
    public ResponseEntity<ApiResponse<List<SubscriptionPlan>>> getActivePlans() {
        List<SubscriptionPlan> plans = subscriptionPlanRepository.findByActiveTrueOrderBySortOrderAsc();
        
        // Filter to ensure only one offer (Basic Level 1 - 2000 INR) is returned
        List<SubscriptionPlan> singleOffer = plans.stream()
                .filter(p -> java.math.BigDecimal.valueOf(2000).compareTo(p.getPrice()) == 0)
                .limit(1)
                .toList();

        // Fallback: If no 2000 INR plan found, modify the first available plan to 2000 INR
        if (singleOffer.isEmpty() && !plans.isEmpty()) {
            SubscriptionPlan firstPlan = plans.get(0);
            firstPlan.setPrice(java.math.BigDecimal.valueOf(2000));
            firstPlan.setName("Basic Level 1");
            singleOffer = java.util.List.of(firstPlan);
        }

        return ResponseEntity.ok(ApiResponse.success(com.example.documentmanagement.util.MessageConstants.Success.SUBSCRIPTION_PLANS_RETRIEVED, singleOffer));
    }
}
