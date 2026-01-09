package com.example.demo.Services.Impls;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.CityRepo;
import com.example.demo.Services.CityService;
import com.example.demo.entity.City;

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
    public City getCityById(Long id) {
        return repository.findById(id).orElse(null);
    }
    @Override
    public boolean deleteCity(long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
    @Override
    public City updateCity(Long id, City cityDetails) {
        Optional<City> optionalCity = repository.findById(id);
        if (optionalCity.isPresent()) {
            City existingCity = optionalCity.get();
            existingCity.setCityName(cityDetails.getCityName());
            return repository.save(existingCity);
        }
        return null;
    }
    
}
