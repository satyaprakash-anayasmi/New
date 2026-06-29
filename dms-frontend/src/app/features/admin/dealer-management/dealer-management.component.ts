import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealerVerificationComponent } from './dealer-verification/dealer-verification.component';
import { DealerProductsComponent } from './dealer-products/dealer-products.component';
import { DealerAssignmentComponent } from './dealer-assignment/dealer-assignment.component';
import { DealerDistributionComponent } from './dealer-distribution/dealer-distribution.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dealer-management',
  standalone: true,
  imports: [
    CommonModule, 
    DealerVerificationComponent, 
    DealerProductsComponent, 
    DealerAssignmentComponent, 
    DealerDistributionComponent, TranslateModule],
  templateUrl: './dealer-management.component.html',
  styleUrls: ['./dealer-management.component.css']
})
export class DealerManagementComponent {
  activeTab = 'verification';
  isAdmin = false;
  isVerifiedDealer = false;
  isLoading = true;

  tabs = [
    { id: 'verification', labelKey: 'ADMIN.DEALER_MGMT.TABS.VERIFICATION', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', requiresVerification: false },
    { id: 'products', labelKey: 'ADMIN.DEALER_MGMT.TABS.PRODUCTS', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', requiresVerification: true },
    { id: 'assignment', labelKey: 'ADMIN.DEALER_MGMT.TABS.ASSIGNMENT', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9', requiresVerification: true },
    { id: 'distribution', labelKey: 'ADMIN.DEALER_MGMT.TABS.DISTRIBUTION', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', requiresVerification: true }
  ];

  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    const userProfile = this.auth.getUserProfile();
    this.isAdmin = userProfile?.roles?.includes('ROLE_ADMIN');

    if (this.isAdmin) {
      this.isVerifiedDealer = true;
      this.isLoading = false;
    } else {
      this.api.getMyDealerProfile().subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            this.isVerifiedDealer = res.data.verificationStatus === 'VERIFIED';
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  get visibleTabs() {
    return this.tabs.filter(t => !t.requiresVerification || this.isVerifiedDealer);
  }

  setTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
