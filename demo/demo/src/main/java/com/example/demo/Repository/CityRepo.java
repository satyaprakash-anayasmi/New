package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.City;

public interface CityRepo extends JpaRepository<City, Long> {
    
}
