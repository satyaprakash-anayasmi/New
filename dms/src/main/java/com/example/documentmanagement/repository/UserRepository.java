package com.example.documentmanagement.repository;

import com.example.documentmanagement.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    List<User> findByRoles_Name(String roleName);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    Optional<User> findByReferralCodeIgnoreCase(String referralCode);
    boolean existsByReferralCodeIgnoreCase(String referralCode);

    List<User> findByReferredBy_Id(Long parentId);

    long countByIsActiveTrue();
    long countByIsActiveFalse();
    long countByPaymentStatus(String paymentStatus);
    long countByPaymentStatusNot(String paymentStatus);

    @Query(value = "WITH RECURSIVE downline AS (" +
                   "  SELECT id FROM users WHERE id = :userId " +
                   "  UNION ALL " +
                   "  SELECT u.id FROM users u " +
                   "  INNER JOIN downline d ON u.referred_by_id = d.id" +
                   ") SELECT id FROM downline WHERE id != :userId", nativeQuery = true)
    List<Long> findDownlineUserIds(@Param("userId") Long userId);

    @Query("SELECT u FROM User u WHERE " +
           "(:search = '' OR " +
           " LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.referralCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:registrationStatus IS NULL OR u.registrationStatus = :registrationStatus) AND " +
           "(:paymentStatus IS NULL OR u.paymentStatus = :paymentStatus) AND " +
           "(COALESCE(:zone, '') = '' OR LOWER(u.zone) = LOWER(:zone)) AND " +
           "(COALESCE(:country, '') = '' OR LOWER(u.country) = LOWER(:country)) AND " +
           "(COALESCE(:state, '') = '' OR LOWER(u.state) = LOWER(:state)) AND " +
           "(COALESCE(:district, '') = '' OR LOWER(u.district) = LOWER(:district)) AND " +
           "(COALESCE(:block, '') = '' OR LOWER(u.block) = LOWER(:block)) AND " +
           "(COALESCE(:town, '') = '' OR LOWER(u.town) = LOWER(:town)) AND " +
           "(COALESCE(:village, '') = '' OR LOWER(u.village) = LOWER(:village)) AND " +
           "(:createdAt IS NULL OR CAST(u.createdAt AS date) = :createdAt)")
    Page<User> searchUsers(@Param("search") String search,
                           @Param("isActive") Boolean isActive,
                           @Param("registrationStatus") String registrationStatus,
                           @Param("paymentStatus") String paymentStatus,
                           @Param("zone") String zone,
                           @Param("country") String country,
                           @Param("state") String state,
                           @Param("district") String district,
                           @Param("block") String block,
                           @Param("town") String town,
                           @Param("village") String village,
                           @Param("createdAt") java.time.LocalDate createdAt,
                           Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.id IN :ids AND " +
           "(:search = '' OR " +
           " LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.referralCode) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:registrationStatus IS NULL OR u.registrationStatus = :registrationStatus) AND " +
           "(:paymentStatus IS NULL OR u.paymentStatus = :paymentStatus) AND " +
           "(COALESCE(:zone, '') = '' OR LOWER(u.zone) = LOWER(:zone)) AND " +
           "(COALESCE(:country, '') = '' OR LOWER(u.country) = LOWER(:country)) AND " +
           "(COALESCE(:state, '') = '' OR LOWER(u.state) = LOWER(:state)) AND " +
           "(COALESCE(:district, '') = '' OR LOWER(u.district) = LOWER(:district)) AND " +
           "(COALESCE(:block, '') = '' OR LOWER(u.block) = LOWER(:block)) AND " +
           "(COALESCE(:town, '') = '' OR LOWER(u.town) = LOWER(:town)) AND " +
           "(COALESCE(:village, '') = '' OR LOWER(u.village) = LOWER(:village)) AND " +
           "(:createdAt IS NULL OR CAST(u.createdAt AS date) = :createdAt)")
    Page<User> searchUsersByIds(@Param("ids") List<Long> ids,
                                @Param("search") String search,
                                @Param("isActive") Boolean isActive,
                                @Param("registrationStatus") String registrationStatus,
                                @Param("paymentStatus") String paymentStatus,
                                @Param("zone") String zone,
                                @Param("country") String country,
                                @Param("state") String state,
                                @Param("district") String district,
                                @Param("block") String block,
                                @Param("town") String town,
                                @Param("village") String village,
                                @Param("createdAt") java.time.LocalDate createdAt,
                                Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.isActive = :isActive")
    long countByRoleNameAndIsActive(@Param("roleName") String roleName, @Param("isActive") boolean isActive);

    @Query("SELECT DISTINCT u.state FROM User u WHERE u.state IS NOT NULL ORDER BY u.state")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT u.district FROM User u WHERE u.state = :state AND u.district IS NOT NULL ORDER BY u.district")
    List<String> findDistinctDistrictsByState(@Param("state") String state);

    @Query("SELECT DISTINCT u.block FROM User u WHERE u.district = :district AND u.block IS NOT NULL ORDER BY u.block")
    List<String> findDistinctBlocksByDistrict(@Param("district") String district);

    @Query("SELECT DISTINCT u.pinCode FROM User u WHERE u.block = :block AND u.pinCode IS NOT NULL ORDER BY u.pinCode")
    List<String> findDistinctPinCodesByBlock(@Param("block") String block);

    @Query("SELECT u FROM User u WHERE u.pinCode = :pinCode AND u.isActive = true ORDER BY u.fullName")
    List<User> findByPinCodeAndIsActiveTrue(@Param("pinCode") String pinCode);

    @Query("SELECT DISTINCT u.username FROM User u WHERE u.username IS NOT NULL AND u.username != '' ORDER BY u.username")
    List<String> findDistinctUsernames();

    @Query("SELECT DISTINCT u.fullName FROM User u WHERE u.fullName IS NOT NULL AND u.fullName != '' ORDER BY u.fullName")
    List<String> findDistinctFullNames();

    @Query("SELECT DISTINCT u.referralCode FROM User u WHERE u.referralCode IS NOT NULL AND u.referralCode != '' ORDER BY u.referralCode")
    List<String> findDistinctReferralCodes();

    @Query("SELECT DISTINCT CAST(u.createdAt AS date) FROM User u WHERE u.createdAt IS NOT NULL ORDER BY CAST(u.createdAt AS date)")
    List<java.sql.Date> findDistinctCreatedDates();

    Page<User> findByRegistrationStatus(String status, Pageable pageable);
    Page<User> findByRegistrationStatusAndIsActive(String status, boolean isActive, Pageable pageable);
    Page<User> findByRegistrationStatusIn(List<String> statuses, Pageable pageable);
}
