import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { UserResponse, DashboardStats, ReferralNode, MasterHeader, MasterDetail } from '../../shared/models/user.model';
import { PagedResponse } from '../../shared/models/paged-response.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private readonly apiService: ApiService) { }

    getReviewers(): Observable<ApiResponse<UserResponse[]>> {
        return this.apiService.getReviewers();
    }

    notifyAdminFacilityInterest(payload: { facilityName: string, userDetails: any }): Observable<any> {
        return this.apiService.notifyAdminFacilityInterest(payload);
    }

    // ─── Dashboard ────────────────────────────────────────────────────────────

    getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
        return this.apiService.getDashboardStats();
    }

    // ─── Admin User CRUD ──────────────────────────────────────────────────────

    getActiveUsers(page = 0, size = 10, search?: string, filters?: Record<string, string>): Observable<ApiResponse<PagedResponse<UserResponse>>> {
        return this.apiService.getActiveUsers(page, size, search, filters);
    }

    getInactiveUsers(page = 0, size = 10, search?: string, filters?: Record<string, string>): Observable<ApiResponse<PagedResponse<UserResponse>>> {
        return this.apiService.getInactiveUsers(page, size, search, filters);
    }

    getUserFilterOptions(): Observable<ApiResponse<Record<string, string[]>>> {
        return this.apiService.getUserFilterOptions();
    }

    getUserById(userId: number): Observable<ApiResponse<UserResponse>> {
        return this.apiService.getUserById(userId);
    }

    updateUser(userId: number, data: any): Observable<ApiResponse<UserResponse>> {
        return this.apiService.updateUser(userId, data);
    }

    deleteUser(userId: number): Observable<ApiResponse<any>> {
        return this.apiService.deleteUser(userId);
    }

    blockUser(userId: number): Observable<ApiResponse<any>> {
        return this.apiService.blockUser(userId);
    }

    recoverUser(userId: number): Observable<ApiResponse<any>> {
        return this.apiService.recoverUser(userId);
    }

    // ─── Referral Tree ────────────────────────────────────────────────────────

    getMyReferralTree(): Observable<ApiResponse<ReferralNode>> {
        return this.apiService.getMyReferralTree();
    }

    getFullReferralTree(): Observable<ApiResponse<ReferralNode>> {
        return this.apiService.getFullReferralTree();
    }

    searchReferralTree(searchTerm: string): Observable<ApiResponse<UserResponse[]>> {
        return this.apiService.searchReferralTree(searchTerm);
    }

    // ─── Master Data ─────────────────────────────────────────────────────────

    getMasterHeaders(status = 'ACTIVE', page = 0, size = 100): Observable<ApiResponse<any>> {
        return this.apiService.getMasterHeaders(status, page, size);
    }

    createMasterHeader(data: { dropdownName: string }): Observable<ApiResponse<MasterHeader>> {
        return this.apiService.createMasterHeader(data);
    }

    updateMasterHeader(id: number, data: { dropdownName?: string; status?: string }): Observable<ApiResponse<MasterHeader>> {
        return this.apiService.updateMasterHeader(id, data);
    }

    deleteMasterHeader(id: number): Observable<ApiResponse<any>> {
        return this.apiService.deleteMasterHeader(id);
    }

    restoreMasterHeader(id: number): Observable<ApiResponse<any>> {
        return this.apiService.restoreMasterHeader(id);
    }

    permanentDeleteMasterHeader(id: number): Observable<ApiResponse<any>> {
        return this.apiService.permanentDeleteMasterHeader(id);
    }

    getMasterDetails(headerId: number, status = 'ACTIVE', page = 0, size = 100): Observable<ApiResponse<any>> {
        return this.apiService.getMasterDetails(headerId, status, page, size);
    }

    createMasterDetail(headerId: number, data: { displayName: string; parent?: { id: number } | null }): Observable<ApiResponse<MasterDetail>> {
        return this.apiService.createMasterDetail(headerId, data);
    }

    updateMasterDetail(id: number, data: Partial<MasterDetail>): Observable<ApiResponse<MasterDetail>> {
        return this.apiService.updateMasterDetail(id, data);
    }

    deleteMasterDetail(id: number): Observable<ApiResponse<any>> {
        return this.apiService.deleteMasterDetail(id);
    }

    restoreMasterDetail(id: number): Observable<ApiResponse<any>> {
        return this.apiService.restoreMasterDetail(id);
    }

    permanentDeleteMasterDetail(id: number): Observable<ApiResponse<any>> {
        return this.apiService.permanentDeleteMasterDetail(id);
    }

    getDropdownOptions(dropdownName: string, parentId?: number): Observable<ApiResponse<{id: number, name: string}[]>> {
        return this.apiService.getDropdownOptions(dropdownName, parentId);
    }

    validatePromoCode(code: string): Observable<ApiResponse<any>> {
        return this.apiService.validatePromoCode(code);
    }
}
