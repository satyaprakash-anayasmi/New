package com.example.springboot.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.springboot.entities.City;

public interface CityRepo extends JpaRepository<City, Integer> {

}
