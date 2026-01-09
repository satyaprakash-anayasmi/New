package com.example.springboot.entities;



import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "City")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CityId")
    private Integer cityId;
    @Column(name = "CityName", length = 100, nullable = false)
    private String cityName;
    @OneToOne(mappedBy = "cities")
    private Contract contracts;
}
