package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CityDto {
     private Long cityId;
    @NotBlank(message = "City name is mandatory")
    private String cityName;

    
}
