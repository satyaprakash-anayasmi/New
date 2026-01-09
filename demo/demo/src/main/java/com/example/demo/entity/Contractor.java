package com.example.demo.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;



@Entity
@Getter
@Setter
@Table(name = "Contract")

public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ContractorId")
    private Long contractorId;

    @NotBlank(message = "Contractor name is mandatory")
    @Column(name = "ContractorName", nullable = false, length = 250)
    private String contractorName;

    @Column(name = "BusinessName", length = 250)
    private String businessName;

    @Column(name = "Address", length = 500)
    private String address;


    @NotBlank(message = "Mobile number is mandatory")
    @Size(max = 15)
    @Column(name = "Mobile", nullable = false, length = 15)
    private String mobile;

    @Email(message = "Email should be valid")
    @Column(name = "Email", length = 50)
    private String email;

    @Column(name = "BankDetails", length = 250)
    private String bankDetails;

    @Size(max = 11)
    @Column(name = "Ifsc", length = 11)
    private String ifsc;

    @Size(max = 12)
    @Column(name = "AadharCardNo", length = 12)
    private String aadharCardNo;

    @Size(max = 10)
    @Column(name = "PanCardNo", length = 10)
    private String panCardNo;

    @Size(max = 15)
    @Column(name = "GstNo", length = 15)
    private String gstNo;

    @NotNull(message = "CreatedBy is mandatory")
    @Column(name = "CreatedBy", nullable = false)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "CreatedDate", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "UpdatedDate")
    private LocalDateTime updatedDate;

    @Column(name = "IsDeleted", nullable = false)
    private Boolean isDeleted = false;

    @OneToOne(cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    @JoinColumn(name = "CityId")
    private City city;
}
