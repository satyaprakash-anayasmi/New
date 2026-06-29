package com.example.documentmanagement.service;

import com.example.documentmanagement.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfileResponse getMyProfile(String username);
    ProfileResponse updateProfile(String username, String fullName, String gender, String dateOfBirth, 
                                  String address, String block, String town, String state, String village, String landmark,
                                  String district, String country, String pinCode, String zone, MultipartFile photo);
    ProfileResponse completePayment(String username);
    ProfileResponse generateReferralCode(String username);
}
