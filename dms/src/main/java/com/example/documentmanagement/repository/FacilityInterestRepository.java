package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.FacilityInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityInterestRepository extends JpaRepository<FacilityInterest, Long> {
}
