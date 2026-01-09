package com.example.demo.Services;

import java.util.List;

import com.example.demo.entity.Contractor;

public interface ContractorService {
    Contractor saveContractor(Contractor contractor);

    List<Contractor> getContractor();

    Contractor getContractorById(Long id);
    boolean deleteContractor(Long id);

    Contractor updateContractor(Long id, Contractor contractorDetails);
    
}
