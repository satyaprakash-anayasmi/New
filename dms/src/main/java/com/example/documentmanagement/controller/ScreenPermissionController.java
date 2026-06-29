package com.example.documentmanagement.controller;

import com.example.documentmanagement.dto.response.ApiResponse;
import com.example.documentmanagement.entity.Role;
import com.example.documentmanagement.entity.RoleScreenPermission;
import com.example.documentmanagement.entity.User;
import com.example.documentmanagement.repository.RoleRepository;
import com.example.documentmanagement.repository.RoleScreenPermissionRepository;
import com.example.documentmanagement.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import com.example.documentmanagement.util.MessageConstants;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/screen-permissions")
@RequiredArgsConstructor
@Tag(name = "Screen Permissions", description = "Admin APIs for role-based screen access management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class ScreenPermissionController {

    private final RoleRepository roleRepository;
    private final RoleScreenPermissionRepository permissionRepository;
    private final UserRepository userRepository;

    // ─── GET all roles with their assigned screens ─────────────────────────────
    @GetMapping("/roles")
    @Operation(summary = "Get all roles with assigned screen permissions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllRolePermissions() {
        List<Role> roles = roleRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Role role : roles) {
            List<String> screens = permissionRepository.findByRole_Id(role.getId())
                    .stream()
                    .map(RoleScreenPermission::getScreenName)
                    .collect(Collectors.toList());

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("roleId", role.getId());
            entry.put("roleName", role.getName());
            entry.put("screens", screens);
            result.add(entry);
        }

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.ROLE_PERMISSIONS_RETRIEVED, result));
    }

    // ─── GET screens for a specific role ───────────────────────────────────────
    @GetMapping("/roles/{roleId}")
    @Operation(summary = "Get screen permissions for a specific role")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRolePermissions(@PathVariable Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        List<String> screens = permissionRepository.findByRole_Id(roleId)
                .stream()
                .map(RoleScreenPermission::getScreenName)
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("roleId", role.getId());
        result.put("roleName", role.getName());
        result.put("screens", screens);

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.ROLE_PERMISSIONS_RETRIEVED, result));
    }

    // ─── PUT (replace) screen list for a role ──────────────────────────────────
    @PutMapping("/roles/{roleId}")
    @Operation(summary = "Update (replace) screen access list for a role")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateRolePermissions(
            @PathVariable Long roleId,
            @RequestBody List<String> screens) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        // Remove existing then re-add
        permissionRepository.deleteByRole_Id(roleId);
        permissionRepository.flush();

        List<RoleScreenPermission> newPerms = screens.stream()
                .filter(s -> s != null && !s.isBlank())
                .distinct()
                .map(screen -> RoleScreenPermission.builder()
                        .role(role)
                        .screenName(screen.trim())
                        .build())
                .collect(Collectors.toList());

        permissionRepository.saveAll(newPerms);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("roleId", role.getId());
        result.put("roleName", role.getName());
        result.put("screens", screens);

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.SCREEN_PERMISSIONS_UPDATED + role.getName(), result));
    }

    // ─── GET all users with their roles and assigned screens ──────────────────
    @GetMapping("/users")
    @Operation(summary = "Get all users with their roles and screen permissions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserScreenPermissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {

        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : allUsers) {
            // Search filter
            if (search != null && !search.isBlank()) {
                String lc = search.toLowerCase();
                boolean matches = (user.getUsername() != null && user.getUsername().toLowerCase().contains(lc))
                        || (user.getFullName() != null && user.getFullName().toLowerCase().contains(lc))
                        || (user.getEmail() != null && user.getEmail().toLowerCase().contains(lc));
                if (!matches) continue;
            }

            List<String> userRoles = user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toList());

            // Collect all screens for all roles this user has
            Set<String> screens = new LinkedHashSet<>();
            for (Role role : user.getRoles()) {
                permissionRepository.findByRole_Id(role.getId())
                        .stream()
                        .map(RoleScreenPermission::getScreenName)
                        .forEach(screens::add);
            }

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", user.getId());
            entry.put("username", user.getUsername());
            entry.put("fullName", user.getFullName());
            entry.put("email", user.getEmail());
            entry.put("roles", userRoles);
            entry.put("screens", new ArrayList<>(screens));
            result.add(entry);
        }

        // Manual pagination
        int from = page * size;
        int to = Math.min(from + size, result.size());
        List<Map<String, Object>> pageData = (from < result.size()) ? result.subList(from, to) : Collections.emptyList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", pageData);
        response.put("totalElements", result.size());
        response.put("totalPages", (int) Math.ceil((double) result.size() / size));
        response.put("page", page);
        response.put("size", size);
        response.put("last", to >= result.size());

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.USER_SCREEN_PERMISSIONS_RETRIEVED, response));
    }

    // ─── PUT: update role for a specific user ──────────────────────────────────
    @PutMapping("/users/{userId}/roles")
    @Operation(summary = "Update roles for a specific user")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserRoles(
            @PathVariable Long userId,
            @RequestBody List<String> roleNames) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<Role> newRoles = roleNames.stream()
                .map(name -> roleRepository.findByName(name)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + name)))
                .collect(Collectors.toList());

        user.getRoles().clear();
        userRepository.saveAndFlush(user);
        user.getRoles().addAll(newRoles);
        userRepository.save(user);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("roles", roleNames);

        return ResponseEntity.ok(ApiResponse.success(MessageConstants.Success.USER_ROLES_UPDATED, result));
    }
}
