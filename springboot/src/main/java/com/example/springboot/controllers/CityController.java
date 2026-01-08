package com.example.springboot.controllers;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.dtos.CityDTO;

import com.example.springboot.entities.City;

import com.example.springboot.services.CityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    @Autowired
    private CityService cityService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/add")
    public ResponseEntity<?> addCity(@Valid @RequestBody CityDTO cityDTO) {
        City cityRequest = modelMapper.map(cityDTO, City.class);
        City savedCity = cityService.saveCity(cityRequest);
        if (savedCity == null) {
            return ResponseEntity.badRequest().body("Failed to save city");
        }
        CityDTO cityResponse = modelMapper.map(savedCity, CityDTO.class);
        return ResponseEntity.ok(cityResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CityDTO>> findAllCities() {
        return ResponseEntity.ok(cityService.getCities().stream()
                .map(city -> modelMapper.map(city, CityDTO.class))
                .collect(java.util.stream.Collectors.toList()));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findCityById(@PathVariable int id) {
        City city = cityService.getCityById(id);    
        if (city == null) {
            return ResponseEntity.status(404).body("City not found with ID: " + id);
        }
        CityDTO cityResponse = modelMapper.map(city, CityDTO.class);
        return ResponseEntity.ok(cityResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable int id) {
        if (cityService.deleteCity(id)) {
            return ResponseEntity.ok("City removed !! " + id);
        }
        return ResponseEntity.notFound().build();
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable int id, @Valid @RequestBody CityDTO cityDTO) {
        City cityRequest = modelMapper.map(cityDTO, City.class);
        City updatedCity = cityService.updateCity(id, cityRequest);
        if (updatedCity == null) {
            return ResponseEntity.notFound().build();
        }
        CityDTO cityResponse = modelMapper.map(updatedCity, CityDTO.class);
        return ResponseEntity.ok(cityResponse);
    }
    
    



  
}
