package com.example.springboot.services;

import java.util.List;

import com.example.springboot.entities.City;

public interface CityService {
    
    City saveCity(City city);

    List<City> getCities();

    City getCityById(int id);

    boolean deleteCity(int id);

    City updateCity(int id, City cityDetails);
    
}
