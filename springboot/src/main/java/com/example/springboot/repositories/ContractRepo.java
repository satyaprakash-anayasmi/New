package com.example.springboot.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot.entities.Contract;

@Repository
public interface ContractRepo extends JpaRepository<Contract, Integer> {
}
