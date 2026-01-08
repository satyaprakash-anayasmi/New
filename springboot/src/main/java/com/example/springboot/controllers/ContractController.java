package com.example.springboot.controllers;

import com.example.springboot.entities.Contract;
import com.example.springboot.services.ContractService;
import com.example.springboot.dtos.ContractDTO;
import java.util.stream.Collectors;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.modelmapper.ModelMapper;
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
public class ContractController {

    @Autowired
    private ContractService service;

    @Autowired
    private ModelMapper modelMapper;


    @PostMapping("/add")
    public ResponseEntity<?> addContract(@Valid @RequestBody ContractDTO contractDTO) {
        Contract contractRequest = modelMapper.map(contractDTO, Contract.class);
        Contract savedContract = service.saveContract(contractRequest);
        if (savedContract == null) {
            return ResponseEntity.badRequest().body("Failed to save contract");
        }
        ContractDTO contractResponse = modelMapper.map(savedContract, ContractDTO.class);
        return ResponseEntity.ok(contractResponse);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ContractDTO>> findAllContracts() {
        return ResponseEntity.ok(service.getContracts().stream()
                .map(contract -> modelMapper.map(contract, ContractDTO.class))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findContractById(@PathVariable int id) {
        Contract contract = service.getContractById(id);
        if (contract == null) {
            return ResponseEntity.status(404).body("Contract not found with ID: " + id);
        }
        ContractDTO contractResponse = modelMapper.map(contract, ContractDTO.class);
        return ResponseEntity.ok(contractResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ContractDTO> updateContract(@PathVariable int id, @Valid @RequestBody ContractDTO contractDTO) {
        Contract contractRequest = modelMapper.map(contractDTO, Contract.class);
        Contract updatedContract = service.updateContract(id, contractRequest);
        if (updatedContract == null) {
            return ResponseEntity.notFound().build();
        }
        ContractDTO contractResponse = modelMapper.map(updatedContract, ContractDTO.class);
        return ResponseEntity.ok(contractResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteContract(@PathVariable int id) {
        if (service.deleteContract(id)) {
            return ResponseEntity.ok("Contract removed !! " + id);
        }
        return ResponseEntity.notFound().build();
    }
}
