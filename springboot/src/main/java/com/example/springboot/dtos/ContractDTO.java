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
    @Size(max = 250)
    private String contractorName;

    @Size(max = 250)
    private String businessName;

    @Size(max = 500)
    private String address;

    @NotBlank(message = "Mobile number is mandatory")
    @Size(max = 15)
    private String mobile;

    @Email(message = "Email should be valid")
    @Size(max = 50)
    private String email;

    @Size(max = 250)
    private String bankDetails;

    @Size(max = 11)
    private String ifsc;

    @Size(max = 12)
    private String aadharCardNo;

    @Size(max = 10)
    private String panCardNo;

    @Size(max = 15)
    private String gstNo;

    @NotNull(message = "CreatedBy is mandatory")
    private String createdBy;

    @NotNull(message = "Cities are mandatory")
    private List<CityDTO> cities;
}