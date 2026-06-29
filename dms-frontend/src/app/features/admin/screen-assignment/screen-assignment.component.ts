import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { TABLE_CONFIG } from '../../../shared/config/table-config';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-screen-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, AppSelectComponent, TranslateModule],
  templateUrl: './screen-assignment.component.html',
  styleUrl: './screen-assignment.component.css',
})
export class ScreenAssignmentComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly searchSubject = new Subject<string>();

  readonly TABLE_CONFIG = TABLE_CONFIG;
  SYSTEM_SCREENS: { label: string; path: string }[] = [];

  // ── Table state ──────────────────────────────────────────────────────────
  users: any[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLast = true;
  searchQuery = '';

  // ── Filter state ─────────────────────────────────────────────────────────
  filterRole = '';
  filterHasScreens = '';
  rolesForFilter: string[] = [];

  // ── Tabs: Users | Roles ───────────────────────────────────────────────────
  activeView: 'USERS' | 'ROLES' = 'USERS';

  // ── Roles panel ──────────────────────────────────────────────────────────
  rolesData: any[] = [];
  isRolesLoading = false;

  // ── Role screen edit modal ────────────────────────────────────────────────
  showRoleModal = false;
  selectedRole: any = null;
  selectedRoleScreens: string[] = [];
  isSavingRole = false;

  // ── User role edit modal ──────────────────────────────────────────────────
  showUserModal = false;
  selectedUser: any = null;
  selectedUserRoles: string[] = [];
  allRoleNames: string[] = [];
  isSavingUser = false;

  constructor(
    private readonly api: ApiService,
    private readonly toast: ToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initSystemScreens();
    this.loadUsers();
    this.loadRoles();

    // Debounced search
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(q => {
        this.searchQuery = q;
        this.currentPage = 0;
        this.loadUsers();
      });
  }

  initSystemScreens(): void {
    const excludePaths = ['welcome', 'login', 'register', 'forgot-password', 'reset-password', '**', ''];
    this.SYSTEM_SCREENS = this.router.config
      .filter(route => {
        const p = route.path;
        if (p === undefined || p === null) return false;
        return !excludePaths.includes(p);
      })
      .map(route => {
        const path = '/' + route.path;
        let label = route.data?.['breadcrumb'] || route.path || '';
        if (label.startsWith('NAV.')) {
          const key = label.replace('NAV.', '');
          label = key.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        } else {
          label = label.split('/').map((pPart: string) => pPart.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')).join(' / ');
        }
        return { label, path };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  get rolesFilterOptions(): { id: string; name: string }[] {
    return [
      { id: '', name: 'All Roles' },
      ...this.allRoleNames.map(r => ({ id: r, name: this.getRoleDisplay(r) }))
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Load users with screen info ─────────────────────────────────────────
  loadUsers(page: number = this.currentPage): void {
    this.isLoading = true;
    this.currentPage = page;

    this.api.getUserScreenPermissions(this.currentPage, this.pageSize, this.searchQuery || undefined)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.data) {
            const content = res.data.content || [];
            // Inject serial number
            this.users = content.map((u: any, i: number) => ({
              ...u,
              sno: this.currentPage * this.pageSize + i + 1,
              roles: Array.isArray(u.roles) ? u.roles.join(', ') : (u.roles || '—'),
              screens: Array.isArray(u.screens) ? u.screens.join(', ') : (u.screens || '—'),
              _rolesRaw: u.roles,
            }));
            this.totalElements = res.data.totalElements || 0;
            this.totalPages = res.data.totalPages || 0;
            this.isLast = res.data.last ?? true;

            // Extract unique roles for filter dropdown
            const roleSet = new Set<string>();
            content.forEach((u: any) => (u.roles || []).forEach((r: string) => roleSet.add(r)));
            this.rolesForFilter = Array.from(roleSet).sort();
          }
        },
        error: () => {
          this.isLoading = false;
          this.toast.showError('Failed to load user screen permissions');
        }
      });
  }

  // ─── Load roles with screen permissions ──────────────────────────────────
  loadRoles(): void {
    this.isRolesLoading = true;
    this.api.getAllRoles().subscribe({
      next: (res) => {
        this.isRolesLoading = false;
        if (res.success) {
          this.rolesData = res.data || [];
          this.allRoleNames = this.rolesData.map((r: any) => r.roleName);
        }
      },
      error: () => {
        this.isRolesLoading = false;
        this.toast.showError('Failed to load roles');
      }
    });
  }

  // ─── Search ───────────────────────────────────────────────────────────────
  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  // ─── Filters ─────────────────────────────────────────────────────────────
  applyFilters(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  clearFilters(): void {
    this.filterRole = '';
    this.filterHasScreens = '';
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadUsers();
  }

  // ─── Pagination ───────────────────────────────────────────────────────────
  onPageChange(page: number): void {
    this.loadUsers(page);
  }

  onPageSizeChange(size: number) {
    if (!size) size = 10;
    this.pageSize = size;
    this.currentPage = 0;
    this.loadUsers();
  }

  // ─── Page number window (max 7 visible) ───────────────────────────────────
  get pageNumbers(): number[] {
    const window = Math.min(this.totalPages, 7);
    const start = Math.max(0, Math.min(this.currentPage - 3, this.totalPages - window));
    return Array.from({ length: Math.min(window, this.totalPages) }, (_, i) => start + i);
  }

  // ─── Open role screen edit modal ──────────────────────────────────────────
  openRoleModal(role: any): void {
    this.selectedRole = role;
    this.selectedRoleScreens = [...(role.screens || [])];
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.selectedRole = null;
    this.selectedRoleScreens = [];
  }

  toggleScreen(screenPath: string): void {
    const idx = this.selectedRoleScreens.indexOf(screenPath);
    if (idx >= 0) {
      this.selectedRoleScreens.splice(idx, 1);
    } else {
      this.selectedRoleScreens.push(screenPath);
    }
  }

  isScreenSelected(screenPath: string): boolean {
    return this.selectedRoleScreens.includes(screenPath);
  }

  saveRoleScreens(): void {
    if (!this.selectedRole) return;
    this.isSavingRole = true;
    this.api.updateRoleScreens(this.selectedRole.roleId, this.selectedRoleScreens).subscribe({
      next: () => {
        this.isSavingRole = false;
        this.toast.showSuccess(`Screen permissions updated for ${this.selectedRole.roleName}`);
        this.closeRoleModal();
        this.loadRoles();
        this.loadUsers();
      },
      error: () => {
        this.isSavingRole = false;
        this.toast.showError('Failed to update role screen permissions');
      }
    });
  }

  // ─── Open user role edit modal ────────────────────────────────────────────
  openUserModal(user: any): void {
    this.selectedUser = user;
    this.selectedUserRoles = Array.isArray(user._rolesRaw) ? [...user._rolesRaw] : [];
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
    this.selectedUserRoles = [];
  }

  toggleRole(roleName: string): void {
    const idx = this.selectedUserRoles.indexOf(roleName);
    if (idx >= 0) {
      this.selectedUserRoles.splice(idx, 1);
    } else {
      this.selectedUserRoles.push(roleName);
    }
  }

  isRoleSelected(roleName: string): boolean {
    return this.selectedUserRoles.includes(roleName);
  }

  saveUserRoles(): void {
    if (!this.selectedUser) return;
    this.isSavingUser = true;
    this.api.updateUserRoles(this.selectedUser.id, this.selectedUserRoles).subscribe({
      next: () => {
        this.isSavingUser = false;
        this.toast.showSuccess(`Roles updated for ${this.selectedUser.username}`);
        this.closeUserModal();
        this.loadUsers();
      },
      error: () => {
        this.isSavingUser = false;
        this.toast.showError('Failed to update user roles');
      }
    });
  }

  removeUserRoles(user: any): void {
    if (confirm(`Are you sure you want to remove all roles for ${user.username}?`)) {
      this.api.updateUserRoles(user.id, []).subscribe({
        next: () => {
          this.toast.showSuccess(`Roles removed for ${user.username}`);
          this.loadUsers();
        },
        error: () => {
          this.toast.showError('Failed to remove user roles');
        }
      });
    }
  }

  // ─── Get screen label by path ─────────────────────────────────────────────
  getScreenLabel(path: string): string {
    return this.SYSTEM_SCREENS.find(s => s.path === path)?.label || path;
  }

  // ─── Get role display name ────────────────────────────────────────────────
  getRoleDisplay(roleName: string): string {
    const raw = roleName.replace('ROLE_', '').replace(/_/g, ' ').trim();
    if (raw.toUpperCase() === 'ADMIN') return 'Admin';
    if (raw.toUpperCase() === 'SECURITY OFFICER') return 'Security Officer';
    if (raw.toUpperCase() === 'USER') return 'User';
    if (raw.toUpperCase() === 'UPLOADER') return 'Member';
    if (raw.toUpperCase() === 'REVIEWER') return 'Reviewer';
    return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }
}
