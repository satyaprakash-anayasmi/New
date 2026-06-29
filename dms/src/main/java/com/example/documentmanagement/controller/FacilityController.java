package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.FacilityInterestRequest;
import com.example.documentmanagement.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping("/interest")
    public ResponseEntity<?> expressInterest(@RequestBody FacilityInterestRequest request) {
        try {
            facilityService.processFacilityInterest(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Facility interest registered successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
