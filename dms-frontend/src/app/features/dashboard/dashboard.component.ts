import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { UserService } from '../../core/services/user.service';
import { UserResponse, DashboardStats } from '../../shared/models/user.model';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { ProfileService } from '../../core/services/profile.service';
import { TABLE_CONFIG, TABLE_CONFIG_MAP } from '../../shared/config/table-config';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, DataTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = false;
  isAdmin = false;
  userProfile = { username: '', role: '', referralCode: '', isActive: false };

  // Dashboard stats (admin only)
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    paidUsers: 0,
    unpaidUsers: 0
  };

  // User listing (admin only)
  users: UserResponse[] = [];
  activeTab: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLast = false;

  // Search term (passed from data-table filter)
  searchTerm = '';

  // ─── Backend Filter Params (all dashboard fields) ──────────────────────────
  filterParams: Record<string, string> = {};

  // ─── Common Table Config ──────────────────────────────────────────────────
  readonly TABLE_CONFIG = TABLE_CONFIG;
  readonly TABLE_CONFIG_MAP = TABLE_CONFIG_MAP;

  // ─── Modal States ─────────────────────────────────────────────────────────
  viewUser: UserResponse | null = null;
  editUser: UserResponse | null = null;
  editData: any = {};
  showViewModal = false;
  showEditModal = false;
  isSaving = false;

  private readonly searchSubject$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly toast: ToastService
  ) { }

  ngOnInit() {
    this.extractUserProfile();
    
    // Fetch profile to get real payment status
    this.profileService.getMyProfile().subscribe((res: any) => {
      if (res.success && res.data) {
        this.userProfile.isActive = (res.data.paymentStatus === 'COMPLETED');
      }
    });

    if (this.isAdmin) {
      this.loadStats();
      
      // Set up debounced search stream
      this.searchSubject$
        .pipe(
          debounceTime(300),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.executeLoadUsers();
        });

      this.loadUsers(0);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  extractUserProfile() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userProfile.username = payload.sub || 'Unknown User';
        this.userProfile.referralCode = payload.referralCode || '';
        this.userProfile.isActive = payload.isActive === true;
        if (payload.roles && payload.roles.length > 0) {
          const role = payload.roles[0].authority || payload.roles[0];
          this.isAdmin = role === 'ROLE_ADMIN';
          if (role === 'ROLE_ADMIN') this.userProfile.role = 'Administrator';
          else if (role === 'ROLE_REVIEWER') this.userProfile.role = 'Reviewer';
          else if (role === 'ROLE_UPLOADER') this.userProfile.role = 'Member';
        }
      } catch (e) {
        // Failed to parse token
      }
    }
  }

  loadStats() {
    this.userService.getDashboardStats().subscribe({
      next: (res) => { if (res.success && res.data) this.stats = res.data; },
      error: () => {}
    });
  }

  loadUsers(page: number = 0) {
    this.isLoading = true;
    this.currentPage = page;
    this.searchSubject$.next();
  }

  executeLoadUsers() {
    const page = this.currentPage;
    // Strip out action columns and non-backend fields; map isPaid to paymentStatus
    const backendFilters: Record<string, string> = {};
    for (const [key, val] of Object.entries(this.filterParams)) {
      if (key === 'actions' || !val || !val.trim()) continue;
      if (key === 'isPaid') {
        // Map frontend 'isPaid' display value to backend paymentStatus
        const v = val.trim().toUpperCase();
        if (v === 'PAID' || v === 'COMPLETED') backendFilters['paymentStatus'] = 'COMPLETED';
        else if (v === 'UNPAID' || v === 'PENDING') backendFilters['paymentStatus'] = 'PENDING';
        continue;
      }
      // Skip text-only columns that backend doesn't accept as standalone params
      if (key === 'fullName' || key === 'username') continue;
      backendFilters[key] = val.trim();
    }

    const search = this.searchTerm?.trim() || undefined;

    const obs = this.activeTab === 'ACTIVE'
      ? this.userService.getActiveUsers(page, this.pageSize, search, backendFilters)
      : this.userService.getInactiveUsers(page, this.pageSize, search, backendFilters);

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const data = res.data as any;
          const rawUsers = data.content ?? (Array.isArray(data) ? data : []);
          this.users = rawUsers.map((u: any) => ({
            ...u,
            isPaid: u.paymentStatus === 'COMPLETED' || u.isPaid === true
          }));
          this.totalElements = data.totalElements ?? this.users.length;
          this.totalPages = data.totalPages ?? 1;
          this.isLast = data.last ?? (page >= this.totalPages - 1);
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  // ─── Data Table Event Handlers ────────────────────────────────────────────

  onTabChange(tab: 'ACTIVE' | 'INACTIVE') {
    this.activeTab = tab;
    this.searchTerm = '';
    this.filterParams = {};
    this.loadUsers(0);
  }

  onPageChange(page: number) {
    this.loadUsers(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.loadUsers(0);
  }

  /**
   * Backend-only filtering: receives filter key-value pairs from the data-table,
   * sends them directly to the API — NO local/frontend filtering applied.
   * Text-searchable columns (username, fullName, referralCode) are merged into searchTerm.
   */
  onFilterChange(filters: Record<string, string>) {
    // Text fields that the backend resolves via the 'search' param (not separate params)
    const textSearchKeys = ['username', 'fullName', 'referralCode'];
    const textParts: string[] = [];

    const newFilters: Record<string, string> = {};
    for (const [key, val] of Object.entries(filters)) {
      if (!val || !val.trim()) continue;
      if (textSearchKeys.includes(key)) {
        textParts.push(val.trim());
      } else {
        newFilters[key] = val.trim();
      }
    }

    // Text search: combine text fields with any existing plain search term
    this.searchTerm = textParts.length > 0 ? textParts.join(' ') : '';
    this.filterParams = newFilters;
    this.loadUsers(0);
  }

  onSearchChange(query: string) {
    // For single search-box queries, map to backend search param
    // Do NOT clear filterParams so dropdown filters remain active
    this.searchTerm = query || '';
    this.loadUsers(0);
  }

  // ─── Actions: Active Users ────────────────────────────────────────────────

  openView(user: UserResponse) {
    this.viewUser = user;
    this.showViewModal = true;
  }

  closeView() {
    this.showViewModal = false;
    this.viewUser = null;
  }

  openEdit(user: UserResponse) {
    this.editUser = { ...user };
    this.editData = {
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      block: user.block || '',
      town: user.town || '',
      state: user.state || '',
      district: user.district || '',
      country: user.country || '',
      pinCode: user.pinCode || '',
      zone: user.zone || ''
    };
    this.showEditModal = true;
  }

  closeEdit() {
    this.showEditModal = false;
    this.editUser = null;
  }

  saveEdit() {
    if (!this.editUser) return;
    this.isSaving = true;
    this.userService.updateUser(this.editUser.id, this.editData).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.showSuccess('User updated successfully');
          this.closeEdit();
          this.loadUsers(this.currentPage);
        } else {
          this.toast.showError(res.message || 'Update failed');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toast.showError('Failed to update user');
      }
    });
  }

  deleteUser(user: UserResponse) {
    if (!confirm(`Are you sure you want to delete user "${user.username}"? This cannot be undone.`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: (res) => {
        this.toast.showSuccess(res.message || 'User deleted');
        this.loadStats();
        this.loadUsers(this.currentPage);
      },
      error: () => this.toast.showError('Failed to delete user')
    });
  }

  blockUser(user: UserResponse) {
    if (!confirm(`Block user "${user.username}"?`)) return;
    this.userService.blockUser(user.id).subscribe({
      next: (res) => {
        this.toast.showSuccess(res.message || 'User blocked');
        this.loadStats();
        this.loadUsers(this.currentPage);
      },
      error: () => this.toast.showError('Failed to block user')
    });
  }

  // ─── Actions: Inactive Users ──────────────────────────────────────────────

  recoverUser(user: UserResponse) {
    if (!confirm(`Recover user "${user.username}"?`)) return;
    this.userService.recoverUser(user.id).subscribe({
      next: (res) => {
        this.toast.showSuccess(res.message || 'User recovered');
        this.loadStats();
        this.loadUsers(this.currentPage);
      },
      error: () => this.toast.showError('Failed to recover user')
    });
  }

  permanentDelete(user: UserResponse) {
    if (!confirm(`PERMANENTLY DELETE "${user.username}"? This cannot be undone!`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: (res) => {
        this.toast.showSuccess(res.message || 'User permanently deleted');
        this.loadStats();
        this.loadUsers(this.currentPage);
      },
      error: () => this.toast.showError('Failed to delete user')
    });
  }
}
