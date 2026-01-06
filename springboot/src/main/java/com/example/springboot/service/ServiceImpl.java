package com.example.springboot.service;

import com.example.springboot.entity.Contract;
import com.example.springboot.repository.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class ServiceImpl implements Service {

    @Autowired
    private Repo repository;

    @Override
    public Contract saveContract(Contract contract) {
        return repository.save(contract);
    }

    @Override
    public List<Contract> getContracts() {
        return repository.findAll();
    }

    @Override
    public Contract getContractById(int id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public boolean deleteContract(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public Contract updateContract(int id, Contract contractDetails) {
        Optional<Contract> optionalContract = repository.findById(id);
        if (optionalContract.isPresent()) {
            Contract existingContract = optionalContract.get();
            existingContract.setContractorName(contractDetails.getContractorName());
            existingContract.setBusinessName(contractDetails.getBusinessName());
            existingContract.setAddress(contractDetails.getAddress());
            existingContract.setCityId(contractDetails.getCityId());
            existingContract.setMobile(contractDetails.getMobile());
            existingContract.setEmail(contractDetails.getEmail());
            existingContract.setBankDetails(contractDetails.getBankDetails());
            existingContract.setIfsc(contractDetails.getIfsc());
            existingContract.setAadharCardNo(contractDetails.getAadharCardNo());
            existingContract.setPanCardNo(contractDetails.getPanCardNo());
            existingContract.setGstNo(contractDetails.getGstNo());
            return repository.save(existingContract);
        }
        return null;
    }
}