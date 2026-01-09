package com.example.demo.Controllers;

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

import com.example.demo.Services.CityService;
import com.example.demo.dto.CityDto;
import com.example.demo.entity.City;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cities")
public class CityController {
    @Autowired
    private CityService cityService;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("/add")
    public ResponseEntity<?> addCity(@Valid @RequestBody CityDto cityDTO) {
        City cityRequest = modelMapper.map(cityDTO, City.class);
        City savedCity = cityService.saveCity(cityRequest);
        if (savedCity == null) {
            return ResponseEntity.badRequest().body("Failed to save city");
        }
        CityDto cityResponse = modelMapper.map(savedCity, CityDto.class);
        return ResponseEntity.ok(cityResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CityDto>> findAllCities() {
        return ResponseEntity.ok(cityService.getCities().stream()
                .map(city -> modelMapper.map(city, CityDto.class))
                .collect(java.util.stream.Collectors.toList()));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> findCityById(@PathVariable Long id) {
        City city = cityService.getCityById(id);    
        if (city == null) {
            return ResponseEntity.status(404).body("City not found with ID: " + id);
        }
        CityDto cityResponse = modelMapper.map(city, CityDto.class);
        return ResponseEntity.ok(cityResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable Long id) {
        if (cityService.deleteCity(id)) {
            return ResponseEntity.ok("City removed !! " + id);
        }
        return ResponseEntity.notFound().build();
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<CityDto> updateCity(@PathVariable Long id, @Valid @RequestBody CityDto cityDTO) {
        City cityRequest = modelMapper.map(cityDTO, City.class);
        City updatedCity = cityService.updateCity(id, cityRequest);
        if (updatedCity == null) {
            return ResponseEntity.notFound().build();
        }
        CityDto cityResponse = modelMapper.map(updatedCity, CityDto.class);
        return ResponseEntity.ok(cityResponse);
    }
    
    



  
}
