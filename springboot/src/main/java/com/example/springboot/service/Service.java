package com.example.springboot.service;

import com.example.springboot.entity.Contract;
import java.util.List;

public interface Service {
    Contract saveContract(Contract contract);

    List<Contract> getContracts();

    Contract getContractById(int id);

    boolean deleteContract(int id);

    Contract updateContract(int id, Contract contractDetails);
}
