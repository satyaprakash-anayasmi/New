package com.example.springboot.dtos;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class ContractDTO {

    private Integer contractId;
    @NotBlank(message = "Contractor name is mandatory")
    private String contractorName;
    private String businessName;
    private String address;
    @NotBlank(message = "Mobile number is mandatory")
    @Size(max = 15)
    private String mobile;
    @Email(message = "Email should be valid")
    private String email;
    private String bankDetails;
    @Size(max = 11)
    private String ifsc;
    @Size(max = 12)
    private String aadharCardNo;
    @Size(max = 10)
    private String panCardNo;
    @Size(max = 15)
    private String gstNo;
    
    private List<CityDTO> cities;
}