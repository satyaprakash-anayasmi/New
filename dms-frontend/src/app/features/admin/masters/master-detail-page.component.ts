import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { MasterHeader } from '../../../shared/models/user.model';
import { ToastService } from '../../../core/services/toast.service';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-master-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AppSelectComponent, TranslateModule],
  templateUrl: './master-detail-page.component.html',
  styleUrl: './master-detail-page.component.css'
})
export class MasterDetailPageComponent implements OnInit {
  headerId!: number;
  header: MasterHeader | null = null;
  details: any[] = [];
  isLoading = false;
  isLoadingHeader = false;

  activeTab: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  // Search / Filter
  searchTerm = '';
  isSearchExpanded = false;

  // Detail form
  showDetailForm = false;
  editingDetail: any | null = null;
  detailForm = { displayName: '' };
  isSaving = false;
  parentOptions: { id: number; name: string }[] = [];
  selectedParentId: number | null = null;

  readonly HIERARCHY_PARENTS: Record<string, string> = {
    STATE: 'COUNTRY',
    DISTRICT: 'STATE',
    SUB_DISTRICT: 'DISTRICT',
    BLOCK: 'SUB_DISTRICT',
    VILLAGE: 'BLOCK'
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('headerId');
      if (id) {
        this.headerId = +id;
        this.loadHeader();
        this.loadDetails(0);
      }
    });
  }

  // ─── Header Info ──────────────────────────────────────────────────────────
  loadHeader() {
    this.isLoadingHeader = true;
    // Get header info by fetching headers list and finding matching one
    this.userService.getMasterHeaders('ACTIVE', 0, 200).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.content ?? []);
          this.header = list.find((h: MasterHeader) => h.id === this.headerId) ?? null;
          if (!this.header) {
            // Try inactive list
            this.userService.getMasterHeaders('INACTIVE', 0, 200).subscribe(res2 => {
              if (res2.success && res2.data) {
                const list2 = Array.isArray(res2.data) ? res2.data : (res2.data.content ?? []);
                this.header = list2.find((h: MasterHeader) => h.id === this.headerId) ?? null;
              }
              this.isLoadingHeader = false;
            });
          } else {
            this.isLoadingHeader = false;
          }
        } else {
          this.isLoadingHeader = false;
        }
      },
      error: () => { this.isLoadingHeader = false; }
    });
  }

  // ─── Details ─────────────────────────────────────────────────────────────
  loadDetails(page = 0) {
    this.isLoading = true;
    this.currentPage = page;
    this.userService.getMasterDetails(this.headerId, this.activeTab, page, this.pageSize).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const data = res.data;
          if (Array.isArray(data)) {
            this.details = data.map(this.enrichDetail);
            this.totalElements = data.length;
            this.totalPages = 1;
          } else {
            this.details = (data.content ?? []).map(this.enrichDetail);
            this.totalElements = data.totalElements ?? 0;
            this.totalPages = data.totalPages ?? 1;
          }
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  enrichDetail = (d: any): any => ({
    ...d,
    parentPath: d.parent ? this.buildPath(d.parent) : '—'
  });

  buildPath(node: any): string {
    const parts: string[] = [];
    let cur = node;
    while (cur) { parts.unshift(cur.displayName); cur = cur.parent; }
    return parts.join(' › ');
  }

  onTabChange(tab: 'ACTIVE' | 'INACTIVE') {
    this.activeTab = tab;
    this.loadDetails(0);
  }

  goBack() { this.router.navigate(['/admin/masters']); }

  // ─── Pagination ──────────────────────────────────────────────────────────
  get isFirst() { return this.currentPage === 0; }
  get isLast() { return this.currentPage >= this.totalPages - 1; }
  prevPage() { if (!this.isFirst) this.loadDetails(this.currentPage - 1); }
  nextPage() { if (!this.isLast) this.loadDetails(this.currentPage + 1); }
  goToPage(p: number) { this.loadDetails(p); }

  readonly pageSizeOptions = [10, 20, 50, 100];
  onPageSizeChange() { this.loadDetails(0); }

  get pages(): number[] {
    const total = Math.min(this.totalPages, 7);
    const start = Math.max(0, Math.min(this.currentPage - 3, this.totalPages - total));
    return Array.from({ length: Math.min(total, this.totalPages) }, (_, i) => start + i);
  }

  // ─── Filtered (client-side search over loaded page) ──────────────────────
  get filteredDetails(): any[] {
    if (!this.searchTerm.trim()) return this.details;
    const t = this.searchTerm.toLowerCase().trim();
    return this.details.filter(d =>
      (d.displayName || '').toLowerCase().includes(t) ||
      (d.parentPath || '').toLowerCase().includes(t)
    );
  }

  // ─── Parent category ─────────────────────────────────────────────────────
  getParentCategoryName(): string {
    if (!this.header) return '';
    return this.HIERARCHY_PARENTS[this.header.dropdownName] || '';
  }

  loadParentOptions() {
    const parentCatName = this.getParentCategoryName();
    if (!parentCatName) return;
    this.userService.getMasterHeaders('ACTIVE', 0, 200).subscribe(res => {
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : (res.data.content ?? []);
        const parentHeader = list.find((h: MasterHeader) => h.dropdownName === parentCatName);
        if (parentHeader) {
          this.userService.getMasterDetails(parentHeader.id, 'ACTIVE', 0, 500).subscribe(res2 => {
            if (res2.success && res2.data) {
              const items = Array.isArray(res2.data) ? res2.data : (res2.data.content ?? []);
              this.parentOptions = items.map((i: any) => ({ id: i.id, name: i.displayName }));
            }
          });
        }
      }
    });
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────
  openAddDetail() {
    this.editingDetail = null;
    this.detailForm = { displayName: '' };
    this.selectedParentId = null;
    this.parentOptions = [];
    this.showDetailForm = true;
    this.loadParentOptions();
  }

  openEditDetail(d: any) {
    this.editingDetail = d;
    this.detailForm = { displayName: d.displayName };
    this.selectedParentId = d.parent?.id ?? null;
    this.parentOptions = [];
    this.showDetailForm = true;
    this.loadParentOptions();
  }

  closeDetailForm() {
    this.showDetailForm = false;
    this.editingDetail = null;
    this.selectedParentId = null;
    this.parentOptions = [];
  }

  saveDetail() {
    if (!this.detailForm.displayName.trim()) { this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_DISPLAY_REQ')); return; }
    const parentCat = this.getParentCategoryName();
    if (parentCat && !this.selectedParentId) {
      this.toast.showError(`${this.translate.instant('ADMIN.MASTER.SELECT_PARENT')} ${parentCat}`);
      return;
    }
    this.isSaving = true;
    const payload: any = {
      displayName: this.detailForm.displayName.trim(),
      parent: this.selectedParentId ? { id: this.selectedParentId } : null
    };
    const obs = this.editingDetail
      ? this.userService.updateMasterDetail(this.editingDetail.id, payload)
      : this.userService.createMasterDetail(this.headerId, payload);
    obs.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.showSuccess(this.editingDetail ? this.translate.instant('ADMIN.MASTER.SUCCESS_OPT_UPDATED') : this.translate.instant('ADMIN.MASTER.SUCCESS_OPT_CREATED'));
          this.closeDetailForm();
          this.loadDetails(this.currentPage);
        } else {
          this.toast.showError(res.message || this.translate.instant('ADMIN.MASTER.ERR_FAILED_SAVE'));
        }
      },
      error: (err) => { this.isSaving = false; this.toast.showError(err.error?.message || this.translate.instant('ADMIN.MASTER.ERR_FAILED_SAVE')); }
    });
  }

  deleteDetail(d: any) {
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_DEACTIVATE_OPT')} "${d.displayName}"?`)) return;
    this.userService.deleteMasterDetail(d.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_OPT_DEACTIVATED')); this.loadDetails(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_DEACTIVATE'))
    });
  }

  restoreDetail(d: any) {
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_RESTORE_OPT')} "${d.displayName}"?`)) return;
    this.userService.restoreMasterDetail(d.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_OPT_RESTORED')); this.loadDetails(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_RESTORE'))
    });
  }

  permanentDeleteDetail(d: any) {
    if (!confirm(`${this.translate.instant('ADMIN.MASTER.CONFIRM_PERM_DELETE')} "${d.displayName}"? ${this.translate.instant('ADMIN.MASTER.CONFIRM_PERM_DELETE_WARN')}`)) return;
    this.userService.permanentDeleteMasterDetail(d.id).subscribe({
      next: () => { this.toast.showSuccess(this.translate.instant('ADMIN.MASTER.SUCCESS_OPT_DELETED')); this.loadDetails(this.currentPage); },
      error: () => this.toast.showError(this.translate.instant('ADMIN.MASTER.ERR_FAILED_DELETE_PERM'))
    });
  }
}
