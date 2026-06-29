package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.RoleScreenPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleScreenPermissionRepository extends JpaRepository<RoleScreenPermission, Long> {
    List<RoleScreenPermission> findByRole_Id(Long roleId);
    List<RoleScreenPermission> findByRole_NameIn(List<String> roleNames);
    void deleteByRole_Id(Long roleId);
}
