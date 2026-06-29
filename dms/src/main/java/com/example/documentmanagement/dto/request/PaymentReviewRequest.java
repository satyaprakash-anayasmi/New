package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentReviewRequest {

    @Size(max = 500, message = "Admin remarks too long")
    private String adminRemarks;
}
