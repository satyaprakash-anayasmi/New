package com.example.springboot.services;

import java.util.List;

import com.example.springboot.entities.Contract;

public interface ContractService {
    Contract saveContract(Contract contract);

    List<Contract> getContracts();

    Contract getContractById(int id);

    boolean deleteContract(int id);

    Contract updateContract(int id, Contract contractDetails);
}
