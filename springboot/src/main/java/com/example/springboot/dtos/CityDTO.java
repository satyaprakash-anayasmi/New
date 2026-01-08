package com.example.springboot.dtos;

import lombok.Data;

@Data
public class CityDTO {
    private Integer cityId;
    private String cityName;
    private String state;
    private String country;
}
