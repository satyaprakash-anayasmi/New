import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { ApiService } from './api.service';

export interface ProfileData {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  block?: string;
  town?: string;
  state?: string;
  village?: string;
  landmark?: string;
  district?: string;
  country?: string;
  pinCode?: string;
  registrationMethod: string;
  profilePhotoUrl: string;
  paymentStatus: string;      // 'PENDING' | 'COMPLETED'
  profileStatus: string;      // 'Active' | 'Inactive'
  isActive: boolean;          // true only after admin approval
  registrationStatus: string;
  createdAt: string;
  updatedAt: string;
  zone?: string;
  referralCode?: string;
  referredByUsername?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private readonly apiService: ApiService) {}

  getMyProfile(): Observable<ApiResponse<ProfileData>> {
    return this.apiService.getMyProfile();
  }

  updateProfile(formData: FormData): Observable<ApiResponse<ProfileData>> {
    return this.apiService.updateProfile(formData);
  }

  generateReferralCode(): Observable<ApiResponse<ProfileData>> {
    return this.apiService.generateReferralCode();
  }
}
