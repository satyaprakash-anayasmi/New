import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { MasterHeader } from '../../../shared/models/user.model';
import { ToastService } from '../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-master-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './master-list.component.html',
  styleUrl: './master-list.component.css'
})
export class MasterListComponent implements OnInit {
  isLoading = false;
  headers: MasterHeader[] = [];
  activeTab: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Search
  searchTerm = '';

  // Header form
  showHeaderForm = false;
  editingHeader: MasterHeader | null = null;
  headerForm = { dropdownName: '' };
  isSaving = false;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadHeaders();
  }

  loadHeaders(page = 0) {
    this.isLoading = true;
    this.currentPage = page;
    this.userService.getMasterHeaders(this.activeTab, page, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const data = res.data;
          if (Array.isArray(data)) {
            this.headers = data;
            this.totalElements = data.length;
            this.totalPages = 1;
          } else {
            this.headers = data.content ?? [];
            this.totalElements = data.totalElements ?? 0;
            this.totalPages = data.totalPages ?? 1;
          }
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredHeaders(): MasterHeader[] {
    if (!this.searchTerm.trim()) return this.headers;
    const t = this.searchTerm.toLowerCase().trim();
    return this.headers.filter(h => h.dropdownName.toLowerCase().includes(t));
  }

  onTabChange(tab: 'ACTIVE' | 'INACTIVE') {
    this.activeTab = tab;
    this.searchTerm = '';
    this.loadHeaders(0);
  }

  navigateToDetail(h: MasterHeader) {
    this.router.navigate(['/admin/masters', h.id]);
  }

  // ─── Pagination ─────────────────────────────────────────────────────────────
  get isFirst() { return this.currentPage === 0; }
  get isLast() { return this.currentPage >= this.totalPages - 1; }
  prevPage() { if (!this.isFirst) this.loadHeaders(this.currentPage - 1); }
  nextPage() { if (!this.isLast) this.loadHeaders(this.currentPage + 1); }
  goToPage(p: number) { this.loadHeaders(p); }

  readonly pageSizeOptions = [10, 20, 50, 100];
  onPageSizeChange() { this.loadHeaders(0); }

  // ─── Header Form ─────────────────────────────────────────────────────────────
  openAddHeader() {
    this.editingHeader = null;
    this.headerForm = { dropdownName: '' };
    this.showHeaderForm = true;
  }

  openEditHeader(h: MasterHeader, e: Event) {
    e.stopPropagation();
    this.editingHeader = h;
    this.headerForm = { dropdownName: h.dropdownName };
    this.showHeaderForm = true;
  }

  closeHeaderForm() {
    this.showHeaderForm = false;
    this.editingHeader = null;
  }

  saveHeader() {
    if (!this.headerForm.dropdownName.trim()) {
      this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_CATEGORY_REQ'));
      return;
    }
    this.isSaving = true;
    const name = this.headerForm.dropdownName.toUpperCase().trim();
    const obs = this.editingHeader
      ? this.userService.updateMasterHeader(this.editingHeader.id, { dropdownName: name })
      : this.userService.createMasterHeader({ dropdownName: name });

    obs.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.showSuccess(this.editingHeader ? this.translate.instant('ADMIN.MASTER.SUCCESS_CAT_UPDATED') : this.translate.instant('ADMIN.MASTER.SUCCESS_CAT_CREATED'));
          this.closeHeaderForm();
          this.loadHeaders(this.currentPage);
        } else {
          this.toast.showError(res.message || this.translate.instant('ADMIN.MASTER.ERR_FAILED_SAVE'));
        }
      },
      error: () => { this.isSaving = false; this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_SAVE')); }
    });
  }

  deleteHeader(h: MasterHeader, e: Event) {
    e.stopPropagation();
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_DEACTIVATE')} "${h.dropdownName}"?`)) return;
    this.userService.deleteMasterHeader(h.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_CAT_DEACTIVATED')); this.loadHeaders(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_DEACTIVATE'))
    });
  }

  restoreHeader(h: MasterHeader, e: Event) {
    e.stopPropagation();
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_RESTORE')} "${h.dropdownName}"?`)) return;
    this.userService.restoreMasterHeader(h.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_CAT_RESTORED')); this.loadHeaders(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_RESTORE'))
    });
  }

  permanentDeleteHeader(h: MasterHeader, e: Event) {
    e.stopPropagation();
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_PERM_DELETE')} "${h.dropdownName}"? ${this.translate.instant('ADMIN.MASTER.CONFIRM_PERM_DELETE_WARN')}`)) return;
    this.userService.permanentDeleteMasterHeader(h.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_PERM_DELETED')); this.loadHeaders(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_DELETE_PERM'))
    });
  }

  // ─── Seed Geo Data ────────────────────────────────────────────────────────────
  async seedGeoData() {
    if (!confirm(this.translate.instant('ADMIN.MASTER.CONFIRM_SEED_GEO'))) return;
    this.isLoading = true;
    const categoriesToCreate = ['COUNTRY', 'STATE', 'DISTRICT', 'SUB_DISTRICT', 'BLOCK', 'VILLAGE'];
    const headerIdMap: Record<string, number> = {};

    try {
      for (const name of categoriesToCreate) {
        try {
          const res = await firstValueFrom(this.userService.createMasterHeader({ dropdownName: name }));
          if (res.success && res.data) headerIdMap[name] = res.data.id;
        } catch {
          const existing = this.headers.find(h => h.dropdownName === name);
          if (existing) headerIdMap[name] = existing.id;
        }
      }
      const headersRes = await firstValueFrom(this.userService.getMasterHeaders());
      if (headersRes.success && headersRes.data) {
        const allHeaders: MasterHeader[] = Array.isArray(headersRes.data) ? headersRes.data : (headersRes.data.content ?? []);
        for (const h of allHeaders) headerIdMap[h.dropdownName] = h.id;
      }
      this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_SEED_GEO'));
      this.loadHeaders(0);
    } catch {
      this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_SEED_GEO'));
    } finally {
      this.isLoading = false;
    }
  }

  get pages(): number[] {
    const total = Math.min(this.totalPages, 7);
    const start = Math.max(0, Math.min(this.currentPage - 3, this.totalPages - total));
    return Array.from({ length: Math.min(total, this.totalPages) }, (_, i) => start + i);
  }
}
