package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.DealerProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DealerProductRepository extends JpaRepository<DealerProduct, Long> {
}
