package com.example.springboot.repository;

import com.example.springboot.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Repo extends JpaRepository<Contract, Integer> {
}
