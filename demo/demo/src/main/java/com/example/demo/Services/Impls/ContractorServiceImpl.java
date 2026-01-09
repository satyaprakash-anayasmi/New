package com.example.demo.Services.Impls;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repository.ContractorRepo;
import com.example.demo.Services.ContractorService;
import com.example.demo.entity.Contractor;

@Service
public class ContractorServiceImpl implements ContractorService {

 
    @Autowired
    private ContractorRepo repository;

    @Override
    public Contractor saveContractor(Contractor contractor) {
        return repository.save(contractor);
    }

    @Override
    public List<Contractor> getContractor() {
        return repository.findAll();
    }

    @Override
    public Contractor getContractorById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public boolean deleteContractor(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Contractor updateContractor(Long id, Contractor contractorDetails) {
        Optional<Contractor> optionalContractor = repository.findById(id);
        if (optionalContractor.isPresent()) {
            Contractor existingContractor = optionalContractor.get();
            existingContractor.setContractorName(contractorDetails.getContractorName());
            existingContractor.setBusinessName(contractorDetails.getBusinessName());
            existingContractor.setAddress(contractorDetails.getAddress());
        

            if (contractorDetails.getCity() != null) {
                existingContractor.setCity(contractorDetails.getCity());
            }

            existingContractor.setMobile(contractorDetails.getMobile());
            existingContractor.setEmail(contractorDetails.getEmail());
            existingContractor.setBankDetails(contractorDetails.getBankDetails());
            existingContractor.setIfsc(contractorDetails.getIfsc());
            existingContractor.setAadharCardNo(contractorDetails.getAadharCardNo());
            existingContractor.setPanCardNo(contractorDetails.getPanCardNo());
            existingContractor.setGstNo(contractorDetails.getGstNo());
            return repository.save(existingContractor);
        }
        return null;
    }
}
    
