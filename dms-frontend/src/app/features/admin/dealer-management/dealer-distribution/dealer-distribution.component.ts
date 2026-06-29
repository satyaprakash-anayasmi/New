import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppSelectComponent } from '../../../../shared/components/app-select/app-select.component';

@Component({
  selector: 'app-dealer-distribution',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, FileUploadComponent, TranslateModule, AppSelectComponent],
  templateUrl: './dealer-distribution.component.html',
  styleUrls: ['./dealer-distribution.component.css']
})
export class DealerDistributionComponent implements OnInit {
  
  verifications: any[] = [];
  totalItems = 0;
  isLoading = false;

  // Filter state
  isFilterOpen = false;
  filters = {
    searchTerm: ''
  };

  // Pagination state
  page = 0;
  pageSize = 10;
  sortBy = 'createdAt';
  sortDir = 'desc';

  // Table Configuration
  headers: any[] = [];

  constructor(
    private api: ApiService, 
    private toast: ToastService,
    private auth: AuthService,
    private translate: TranslateService
  ) {
    this.initHeaders();
  }

  initHeaders() {
    this.translate.onLangChange.subscribe(() => {
      this.headers = [
        { key: 'dealerUsername', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_DEALER') },
        { key: 'customerName', label: this.translate.instant('DEALER_DISTRIBUTION.CUSTOMER_DETAILS') },
        { key: 'productName', label: this.translate.instant('DEALER_DISTRIBUTION.PRODUCT') },
        { key: 'targetQuantity', label: this.translate.instant('DEALER_DISTRIBUTION.QUANTITY') },
        { key: 'verificationStatus', label: this.translate.instant('DEALER_DISTRIBUTION.STATUS') },
        { key: 'actions', label: this.translate.instant('DEALER_DISTRIBUTION.ACTION'), type: 'registration_actions' }
      ];
    });
  }

  isAdmin = false;
  isModalOpen = false;
  isSubmitting = false;
  myAssignments: any[] = [];
  proofForm = {
    assignmentId: null,
    customerName: '',
    details: '',
    photoProofUrl: ''
  };

  get assignmentOptions() {
    return this.myAssignments.map((a: any) => ({
      id: a.id,
      name: `${a.productName} (Target: ${a.targetQuantity})`
    }));
  }

  ngOnInit(): void {
    this.headers = [
      { key: 'dealerUsername', label: this.translate.instant('ADMIN.DEALER_MGMT.COL_DEALER') },
      { key: 'customerName', label: this.translate.instant('DEALER_DISTRIBUTION.CUSTOMER_DETAILS') },
      { key: 'productName', label: this.translate.instant('DEALER_DISTRIBUTION.PRODUCT') },
      { key: 'targetQuantity', label: this.translate.instant('DEALER_DISTRIBUTION.QUANTITY') },
      { key: 'verificationStatus', label: this.translate.instant('DEALER_DISTRIBUTION.STATUS') },
      { key: 'actions', label: this.translate.instant('DEALER_DISTRIBUTION.ACTION'), type: 'registration_actions' }
    ];

    const userProfile = this.auth.getUserProfile();
    this.isAdmin = userProfile?.roles?.includes('ROLE_ADMIN');
    
    if (!this.isAdmin) {
      this.headers = this.headers.filter(h => h.key !== 'actions');
      this.loadMyAssignments();
    }
    
    this.loadVerifications();
  }

  loadMyAssignments(): void {
    // Load assignments for the current dealer
    this.api.getAllDealerAssignments({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        if (res.success) {
          this.myAssignments = res.data.content;
        }
      }
    });
  }

  openSubmitProofModal(): void {
    this.proofForm = {
      assignmentId: null,
      customerName: '',
      details: '',
      photoProofUrl: ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onProofUploaded(url: string): void {
    this.proofForm.photoProofUrl = url;
  }

  submitProof(): void {
    if (!this.proofForm.assignmentId || !this.proofForm.customerName || !this.proofForm.photoProofUrl) {
      this.toast.showError('Please fill all required fields');
      return;
    }
    this.isSubmitting = true;
    this.api.submitDistributionVerification(this.proofForm).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.toast.showSuccess('Proof submitted successfully');
          this.closeModal();
          this.loadVerifications();
        } else {
          this.toast.showError('Failed to submit proof');
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.toast.showError('Error submitting proof');
      }
    });
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  loadVerifications(): void {
    this.isLoading = true;
    
    const params = {
      searchTerm: this.filters.searchTerm || null,
      page: this.page,
      size: this.pageSize,
      sortBy: this.sortBy,
      sortDir: this.sortDir
    };

    this.api.getAllDealerVerifications(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.verifications = res.data.content;
          this.totalItems = res.data.totalElements;
        }
      },
      error: () => {
        this.isLoading = false;
        this.toast.showError('Failed to load verifications');
      }
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadVerifications();
  }

  resetFilters(): void {
    this.filters = { searchTerm: '' };
    this.page = 0;
    this.loadVerifications();
  }

  onPageChange(pageIndex: number): void {
    this.page = pageIndex;
    this.loadVerifications();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.loadVerifications();
  }

  onApprove(row: any): void {
    this.updateStatus(row.id, 'APPROVED');
  }

  onReject(row: any): void {
    const remarks = prompt("Please enter rejection remarks:");
    if (remarks !== null) {
      this.updateStatus(row.id, 'REJECTED', remarks);
    }
  }

  updateStatus(id: number, status: string, remarks?: string): void {
    this.api.verifyDistribution(id, status, remarks).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.showSuccess(`Verification ${status.toLowerCase()} successfully`);
          this.loadVerifications();
        } else {
          this.toast.showError('Failed to update verification status');
        }
      },
      error: () => this.toast.showError('Error updating verification status')
    });
  }
}
