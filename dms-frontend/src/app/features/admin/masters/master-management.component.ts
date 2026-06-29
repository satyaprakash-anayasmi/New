import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { MasterHeader, MasterDetail } from '../../../shared/models/user.model';
import { ToastService } from '../../../core/services/toast.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';
import { TABLE_CONFIG } from '../../../shared/config/table-config';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-master-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, AppSelectComponent, TranslateModule],
  templateUrl: './master-management.component.html',
  styleUrl: './master-management.component.css'
})
export class MasterManagementComponent implements OnInit {
  isLoading = false;
  headers: MasterHeader[] = [];
  selectedHeader: MasterHeader | null = null;
  details: MasterDetail[] = [];
  isLoadingDetails = false;

  // ─── Common Table Config for Detail Rows ──────────────────────────────────
  readonly TABLE_CONFIG = TABLE_CONFIG;
  detailHeaders: any[] = [];
  activeTab: 'ACTIVE' | 'INACTIVE' = 'ACTIVE';

  // Header form
  showHeaderForm = false;
  editingHeader: MasterHeader | null = null;
  headerForm = { dropdownName: '' };

  // Detail form
  showDetailForm = false;
  editingDetail: MasterDetail | null = null;
  detailForm = { displayName: '' };
  isSaving = false;
  parentOptions: { id: number; name: string }[] = [];
  selectedParentId: number | null = null;

  readonly HIERARCHY_PARENTS: Record<string, string> = {
    'STATE':        'COUNTRY',
    'DISTRICT':     'STATE',
    'SUB_DISTRICT': 'DISTRICT',
    'BLOCK':        'SUB_DISTRICT',
    'VILLAGE':      'BLOCK'
  };

  constructor(
    private readonly userService: UserService,
    private readonly toast: ToastService
  ) {
    // Static detail table headers matching backend fields
    this.detailHeaders = [
      { key: 'displayName', label: 'Name', type: 'text' },
      { key: 'status', label: 'Status', type: 'badge' }
    ];
  }

  ngOnInit() {
    this.loadHeaders();
  }

  loadHeaders() {
    this.isLoading = true;
    this.userService.getMasterHeaders(this.activeTab).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          // Backend returns Page<MasterHeader> - extract content array
          const data = res.data;
          this.headers = Array.isArray(data) ? data : (data.content ?? []);
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  onTabChange(tab: 'ACTIVE' | 'INACTIVE') {
    this.activeTab = tab;
    this.selectedHeader = null;
    this.details = [];
    this.loadHeaders();
  }

  selectHeader(header: MasterHeader) {
    this.selectedHeader = header;
    this.loadDetails(header.id);
  }

  loadDetails(headerId: number) {
    this.isLoadingDetails = true;
    this.details = [];
    this.userService.getMasterDetails(headerId, this.activeTab).subscribe({
      next: (res) => {
        this.isLoadingDetails = false;
        if (res.success && res.data) {
          const data = res.data;
          const list = Array.isArray(data) ? data : (data.content ?? []);
          this.details = list.map((detail: any) => ({
            ...detail,
            parentPath: detail.parent ? this.getHierarchyPath(detail.parent) : 'N/A'
          }));
        }
      },
      error: () => { this.isLoadingDetails = false; }
    });
  }

  // ─── Table Event Dispatchers ──────────────────────────────────────────────

  getDetailFormTitle(): string {
    return this.editingDetail ? 'Edit Detail' : 'Add Detail';
  }

  onDetailEdit(item: any) {
    this.openEditDetail(item as MasterDetail);
  }

  onDetailDelete(item: any) {
    this.deleteDetail(item as MasterDetail);
  }

  onDetailRestore(item: any) {
    this.restoreDetail(item as MasterDetail);
  }

  onDetailPermanentDelete(item: any) {
    this.permanentDeleteDetail(item as MasterDetail);
  }

  // ─── Seed Geo Data ────────────────────────────────────────────────────────

  async seedGeoData() {
    if (!confirm('This will seed the LGD hierarchy categories:\nCOUNTRY → STATE → DISTRICT → SUB_DISTRICT → BLOCK → VILLAGE\n\nExisting categories will be preserved. Continue?')) return;
    this.isLoading = true;

    // LGD Administrative Hierarchy category names
    const categoriesToCreate = [
      'COUNTRY', 'STATE', 'DISTRICT', 'SUB_DISTRICT', 'BLOCK', 'VILLAGE'
    ];

    // Map to track created header IDs
    const headerIdMap: Record<string, number> = {};

    try {
      // Step 1: Create all headers (categories), skipping if they exist
      for (const name of categoriesToCreate) {
        try {
          const res = await firstValueFrom(
            this.userService.createMasterHeader({ dropdownName: name })
          );
          if (res.success && res.data) {
            headerIdMap[name] = res.data.id;
          }
        } catch (e: any) {
          // Header might already exist - try to find it from the list
          const existing = this.headers.find(h => h.dropdownName === name);
          if (existing) {
            headerIdMap[name] = existing.id;
          }
        }
      }

      // Reload headers to get newly created ones
      const headersRes = await firstValueFrom(this.userService.getMasterHeaders());
      if (headersRes.success && headersRes.data) {
        const allHeaders: MasterHeader[] = Array.isArray(headersRes.data)
          ? headersRes.data
          : (headersRes.data.content ?? []);
        for (const h of allHeaders) {
          headerIdMap[h.dropdownName] = h.id;
        }
        this.headers = allHeaders;
      }

      // Step 2: Seed hierarchy - Country → State → District → Block → Village → Town
      const hierarchy = [
        {
          type: 'COUNTRY', name: 'India',
          children: [
            {
              type: 'STATE', name: 'Maharashtra',
              children: [
                {
                  type: 'DISTRICT', name: 'Pune',
                  children: [
                    {
                      type: 'BLOCK', name: 'Haveli',
                      children: [
                        {
                          type: 'VILLAGE', name: 'Khadakwasla',
                          children: [
                            { type: 'TOWN', name: 'Town A', children: [] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'STATE', name: 'Gujarat',
              children: [
                {
                  type: 'DISTRICT', name: 'Ahmedabad',
                  children: [
                    {
                      type: 'BLOCK', name: 'Daskroi',
                      children: [
                        {
                          type: 'VILLAGE', name: 'Narol',
                          children: [
                            { type: 'TOWN', name: 'Narol Town', children: [] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      const processNode = async (node: { type: string; name: string; children: any[] }, parentId?: number): Promise<number | undefined> => {
        const headerId = headerIdMap[node.type];
        if (!headerId) {
          console.warn(`No header found for type: ${node.type}`);
          return undefined;
        }
        let createdId: number | undefined;
        try {
          const payload: { displayName: string; parent?: { id: number } | null } = {
            displayName: node.name,
            ...(parentId ? { parent: { id: parentId } } : { parent: null })
          };
          const res = await firstValueFrom(this.userService.createMasterDetail(headerId, payload));
          if (res.success && res.data) {
            createdId = res.data.id;
          }
        } catch (e) {
          console.warn(`Could not create detail for ${node.type}: ${node.name}`);
        }

        if (createdId && node.children?.length > 0) {
          for (const child of node.children) {
            await processNode(child, createdId);
          }
        }
        return createdId;
      };

      for (const root of hierarchy) {
        await processNode(root);
      }

      this.toast.showSuccess('✅ Geographical data seeded successfully!');
      this.loadHeaders();
    } catch (error) {
      this.toast.showError('Failed to seed data. Some items may have already existed.');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // ─── Header CRUD ──────────────────────────────────────────────────────────

  openAddHeader() {
    this.editingHeader = null;
    this.headerForm = { dropdownName: '' };
    this.showHeaderForm = true;
  }

  openEditHeader(h: MasterHeader) {
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
      this.toast.showError('Category name is required');
      return;
    }
    this.isSaving = true;
    const obs = this.editingHeader
      ? this.userService.updateMasterHeader(this.editingHeader.id, { dropdownName: this.headerForm.dropdownName.toUpperCase().trim() })
      : this.userService.createMasterHeader({ dropdownName: this.headerForm.dropdownName.toUpperCase().trim() });

    obs.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.showSuccess(this.editingHeader ? 'Category updated' : 'Category created');
          this.closeHeaderForm();
          this.loadHeaders();
        } else {
          this.toast.showError(res.message || 'Failed to save category');
        }
      },
      error: () => {
        this.isSaving = false;
        this.toast.showError('Failed to save category');
      }
    });
  }

  deleteHeader(h: MasterHeader) {
    if (!confirm(`Delete master category "${h.dropdownName}"?`)) return;
    this.userService.deleteMasterHeader(h.id).subscribe({
      next: () => {
        this.toast.showSuccess('Category deactivated');
        if (this.selectedHeader?.id === h.id) {
          this.selectedHeader = null;
          this.details = [];
        }
        this.loadHeaders();
      },
      error: () => this.toast.showError('Failed to deactivate category')
    });
  }

  restoreHeader(h: MasterHeader) {
    if (!confirm(`Restore master category "${h.dropdownName}"?`)) return;
    this.userService.restoreMasterHeader(h.id).subscribe({
      next: () => {
        this.toast.showSuccess('Category restored');
        this.loadHeaders();
      },
      error: () => this.toast.showError('Failed to restore category')
    });
  }

  permanentDeleteHeader(h: MasterHeader) {
    if (!confirm(`PERMANENTLY DELETE master category "${h.dropdownName}"? This cannot be undone.`)) return;
    this.userService.permanentDeleteMasterHeader(h.id).subscribe({
      next: () => {
        this.toast.showSuccess('Category permanently deleted');
        this.loadHeaders();
      },
      error: () => this.toast.showError('Failed to delete category')
    });
  }

  // ─── Detail CRUD ──────────────────────────────────────────────────────────

  getHierarchyPath(detail: any): string {
    const parts: string[] = [];
    let current: any = detail;
    while (current) {
      parts.unshift(current.displayName);
      current = current.parent;
    }
    return parts.join(' ➔ ');
  }

  getParentCategoryName(): string {
    if (!this.selectedHeader) return '';
    return this.HIERARCHY_PARENTS[this.selectedHeader.dropdownName] || '';
  }

  openAddDetail() {
    if (!this.selectedHeader) return;
    this.editingDetail = null;
    this.detailForm = { displayName: '' };
    this.selectedParentId = null;
    this.parentOptions = [];
    this.showDetailForm = true;

    // Load parent options if this header depends on another category
    const parentHeaderName = this.getParentCategoryName();
    if (parentHeaderName) {
      const parentHeader = this.headers.find(h => h.dropdownName === parentHeaderName);
      if (parentHeader) {
        this.userService.getMasterDetails(parentHeader.id, 'ACTIVE').subscribe({
          next: (res) => {
            const data = res.data;
            const list = Array.isArray(data) ? data : (data.content ?? []);
            this.parentOptions = list.map((item: any) => ({
              id: item.id,
              name: item.displayName || item.name
            }));
          }
        });
      }
    }
  }

  openEditDetail(d: MasterDetail) {
    this.editingDetail = d;
    this.detailForm = { displayName: d.displayName };
    this.selectedParentId = d.parent ? d.parent.id : null;
    this.parentOptions = [];
    this.showDetailForm = true;

    // Load parent options
    const parentHeaderName = this.getParentCategoryName();
    if (parentHeaderName) {
      const parentHeader = this.headers.find(h => h.dropdownName === parentHeaderName);
      if (parentHeader) {
        this.userService.getMasterDetails(parentHeader.id, 'ACTIVE').subscribe({
          next: (res) => {
            const data = res.data;
            const list = Array.isArray(data) ? data : (data.content ?? []);
            this.parentOptions = list.map((item: any) => ({
              id: item.id,
              name: item.displayName || item.name
            }));
          }
        });
      }
    }
  }

  closeDetailForm() {
    this.showDetailForm = false;
    this.editingDetail = null;
    this.selectedParentId = null;
    this.parentOptions = [];
  }

  saveDetail() {
    if (!this.detailForm.displayName.trim()) {
      this.toast.showError('Name is required');
      return;
    }
    if (!this.selectedHeader) return;

    // Validation: if this category depends on a parent, verify parent selection
    const parentCategory = this.getParentCategoryName();
    if (parentCategory && !this.selectedParentId) {
      this.toast.showError(`Please select a parent ${parentCategory} under this hierarchy.`);
      return;
    }

    this.isSaving = true;

    const payload: any = {
      displayName: this.detailForm.displayName.trim(),
      parent: this.selectedParentId ? { id: this.selectedParentId } : null
    };

    const obs = this.editingDetail
      ? this.userService.updateMasterDetail(this.editingDetail.id, payload)
      : this.userService.createMasterDetail(this.selectedHeader.id, payload);

    obs.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.toast.showSuccess(this.editingDetail ? 'Option updated' : 'Option created');
          this.closeDetailForm();
          this.loadDetails(this.selectedHeader!.id);
        } else {
          this.toast.showError(res.message || 'Failed to save option');
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.toast.showError(err.error?.message || 'Failed to save option');
      }
    });
  }

  deleteDetail(d: MasterDetail) {
    if (!confirm(`Deactivate "${d.displayName}"?`)) return;
    this.userService.deleteMasterDetail(d.id).subscribe({
      next: () => {
        this.toast.showSuccess('Option deactivated');
        this.loadDetails(this.selectedHeader!.id);
      },
      error: () => this.toast.showError('Failed to deactivate option')
    });
  }

  restoreDetail(d: MasterDetail) {
    if (!confirm(`Restore "${d.displayName}"?`)) return;
    this.userService.restoreMasterDetail(d.id).subscribe({
      next: () => {
        this.toast.showSuccess('Option restored');
        this.loadDetails(this.selectedHeader!.id);
      },
      error: () => this.toast.showError('Failed to restore option')
    });
  }

  permanentDeleteDetail(d: MasterDetail) {
    if (!confirm(`PERMANENTLY DELETE "${d.displayName}"? This cannot be undone.`)) return;
    this.userService.permanentDeleteMasterDetail(d.id).subscribe({
      next: () => {
        this.toast.showSuccess('Option permanently deleted');
        this.loadDetails(this.selectedHeader!.id);
      },
      error: () => this.toast.showError('Failed to delete option')
    });
  }
}
