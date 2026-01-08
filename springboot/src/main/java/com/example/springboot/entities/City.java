package com.example.springboot.entities;


import java.util.List;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@Table(name = "City")
public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CityId")
    private Integer cityId;
    @Column(name = "CityName", length = 100, nullable = false)
    private String cityName;
    @Column(name = "State", length = 100, nullable = false)
    private String state;
    @Column(name = "Country", length = 100, nullable = false)
    private String country;

    @ManyToMany(mappedBy = "cities",cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    private List<Contract> contracts;
}
