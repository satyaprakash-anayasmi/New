package com.example.demo.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.Services.ContractorService;
import com.example.demo.dto.ContractorDto;
import com.example.demo.entity.Contractor;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/contractors")
public class ContractorController {

    @Autowired
    private ContractorService service;

    @Autowired
    private ModelMapper modelMapper;


    
    @PostMapping("/add")
    public ResponseEntity<?> addContractor(@Valid @RequestBody ContractorDto contractorDto) {
        Contractor contractRequest = modelMapper.map(contractorDto, Contractor.class);
        Contractor savedContractor = service.saveContractor(contractRequest);
        if (savedContractor == null) {
            return ResponseEntity.badRequest().body("Failed to save contractor");
        }
        ContractorDto contractResponse = modelMapper.map(savedContractor, ContractorDto.class);
        return ResponseEntity.ok(contractResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ContractorDto>> findAllContracts() {
        return ResponseEntity.ok(service.getContractor().stream()
                .map(contract -> modelMapper.map(contract, ContractorDto.class))
                .collect(Collectors.toList()));
    }

     @GetMapping("/{id}")
    public ResponseEntity<?> findContractById(@PathVariable Long id) {
        Contractor contract = service.getContractorById(id);
        if (contract == null) {
            return ResponseEntity.status(404).body("Contractor not found with ID: " + id);
        }
        ContractorDto contractResponse = modelMapper.map(contract, ContractorDto.class);
        return ResponseEntity.ok(contractResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ContractorDto> updateContract(@PathVariable Long id, @Valid @RequestBody ContractorDto contractorDto) {
        Contractor contractRequest = modelMapper.map(contractorDto, Contractor.class);
        Contractor updatedContract = service.updateContractor(id, contractRequest);
        if (updatedContract == null) {
            return ResponseEntity.notFound().build();
        }
        ContractorDto contractResponse = modelMapper.map(updatedContract, ContractorDto.class);
        return ResponseEntity.ok(contractResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable Long id) {
        if (service.deleteContractor(id)) {
            return ResponseEntity.ok("Contractor removed !! " + id);
        }
        return ResponseEntity.notFound().build();
    }

    
}
