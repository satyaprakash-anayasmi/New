package com.example.documentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForgotPasswordRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier;

    @Builder.Default
    private String method = "EMAIL"; // EMAIL or PHONE
}
