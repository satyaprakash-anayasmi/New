package com.example.curd.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.curd.entities.MeetingEntity;

@Repository
public interface MeetingRepository extends JpaRepository<MeetingEntity, Long> {

}