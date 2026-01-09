package com.example.demo.Services;

import java.util.List;

import com.example.demo.entity.City;

public interface CityService {
    City saveCity(City city);

    List<City> getCities();

    City getCityById(Long id);

    boolean deleteCity(long id);

    City updateCity(Long id, City cityDetails);
}
