package com.example.springboot.services.Impls;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springboot.entities.City;
import com.example.springboot.repositories.CityRepo;
import com.example.springboot.services.CityService; 
@Service
public class CityServiceImpl implements CityService {

    @Autowired
    private CityRepo repository;
    @Override
    public City saveCity(City city) {
        return repository.save(city);
    }

    @Override
    public List<City> getCities() {
        return repository.findAll();
    }
    @Override
    public City getCityById(int id) {
        return repository.findById(id).orElse(null);
    }
    @Override
    public boolean deleteCity(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
    @Override
    public City updateCity(int id, City cityDetails) {
        Optional<City> optionalCity = repository.findById(id);
        if (optionalCity.isPresent()) {
            City existingCity = optionalCity.get();
            existingCity.setCityName(cityDetails.getCityName());
            return repository.save(existingCity);
        }
        return null;
    }
}