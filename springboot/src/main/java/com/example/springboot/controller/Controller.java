package com.example.springboot.controller;

import com.example.springboot.entity.Contract;
import com.example.springboot.service.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
@RequestMapping("/contracts")
public class Controller {

    @Autowired
    private Service service;

    @PostMapping("/add")
    public ResponseEntity<?> addContract(@Valid @RequestBody Contract contract) {
        Contract savedContract = service.saveContract(contract);
        if (savedContract == null) {
            return ResponseEntity.badRequest().body("Failed to save contract");
        }
        return ResponseEntity.ok(savedContract);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Contract>> findAllContracts() {
        return ResponseEntity.ok(service.getContracts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findContractById(@PathVariable int id) {
        Contract contract = service.getContractById(id);
        if (contract == null) {
            return ResponseEntity.status(404).body("Contract not found with ID: " + id);
        }
        return ResponseEntity.ok(contract);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Contract> updateContract(@PathVariable int id, @Valid @RequestBody Contract contract) {
        Contract updatedContract = service.updateContract(id, contract);
        if (updatedContract == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedContract);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable int id) {
        if (service.deleteContract(id)) {
            return ResponseEntity.ok("Contract removed !! " + id);
        }
        return ResponseEntity.notFound().build();
    }
}
