package com.example.curd.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.curd.entities.BookingEntity;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

}