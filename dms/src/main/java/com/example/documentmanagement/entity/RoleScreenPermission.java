package com.example.documentmanagement.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_screen_permissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"role_id", "screen_name"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleScreenPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "screen_name", nullable = false, length = 100)
    private String screenName;
}
