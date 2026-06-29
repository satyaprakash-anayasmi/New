import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, PaymentRecord } from '../../../core/services/payment.service';
import { ToastService } from '../../../core/services/toast.service';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { TABLE_CONFIG } from '../../../shared/config/table-config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, TranslateModule],
  templateUrl: './admin-payments.component.html',
  styleUrl: './admin-payments.component.css'
})
export class AdminPaymentsComponent implements OnInit {

  payments: PaymentRecord[] = [];
  isLoading = false;
  activeFilter: StatusFilter = 'ALL';

  // ── Central Table Config ─────────────────────────────────────────────
  readonly TABLE_CONFIG = TABLE_CONFIG;

  headers: any[] = [];

  constructor(
    private readonly paymentService: PaymentService,
    private readonly toastService: ToastService,
    private readonly translate: TranslateService
  ) {
    const cfg = TABLE_CONFIG['ADMIN_PAYMENTS'];
    if (cfg) {
      this.headers = Object.keys(cfg.desktopColumns).map((key: string) => ({
        key,
        label: cfg.desktopColumns[key],
        type: cfg.columnTypes?.[key]
      }));
    }
  }

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLast = true;

  // Review modal state
  reviewModal: {
    open: boolean;
    payment: PaymentRecord | null;
    action: 'approve' | 'reject' | null;
    adminRemarks: string;
    isProcessing: boolean;
  } = { open: false, payment: null, action: null, adminRemarks: '', isProcessing: false };

  readonly filters: { label: string; value: StatusFilter; color: string }[] = [
    { label: 'ADMIN.COMMON.ALL',      value: 'ALL',      color: 'bg-slate-600 hover:bg-slate-500' },
    { label: 'ADMIN.PAYMENT_REVIEW.PENDING',  value: 'PENDING',  color: 'bg-amber-600 hover:bg-amber-500' },
    { label: 'ADMIN.PAYMENT_REVIEW.APPROVED', value: 'APPROVED', color: 'bg-emerald-600 hover:bg-emerald-500' },
    { label: 'ADMIN.PAYMENT_REVIEW.REJECTED', value: 'REJECTED', color: 'bg-rose-600 hover:bg-rose-500' }
  ];



  ngOnInit(): void {
    this.loadPayments();
  }

  setFilter(filter: StatusFilter): void {
    this.activeFilter = filter;
    this.currentPage = 0;
    this.loadPayments();
  }

  loadPayments(page: number = this.currentPage): void {
    this.isLoading = true;
    this.currentPage = page;
    this.paymentService.getAllPayments(this.activeFilter, this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.payments       = res.data.content ?? [];
          this.totalElements  = res.data.totalElements ?? 0;
          this.totalPages     = res.data.totalPages ?? 0;
          this.isLast         = res.data.last ?? true;
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  openReview(payment: PaymentRecord, action: 'approve' | 'reject'): void {
    this.reviewModal = { open: true, payment, action, adminRemarks: '', isProcessing: false };
  }

  closeModal(): void {
    this.reviewModal = { open: false, payment: null, action: null, adminRemarks: '', isProcessing: false };
  }

  confirmReview(): void {
    if (!this.reviewModal.payment || !this.reviewModal.action) return;
    this.reviewModal.isProcessing = true;
    const { id } = this.reviewModal.payment;
    const remarks = this.reviewModal.adminRemarks || undefined;

    const obs = this.reviewModal.action === 'approve'
      ? this.paymentService.approvePayment(id, remarks)
      : this.paymentService.rejectPayment(id, remarks);

    obs.subscribe({
      next: (res: any) => {
        this.reviewModal.isProcessing = false;
        if (res.success) {
          const msg = this.reviewModal.action === 'approve'
            ? this.translate.instant('ADMIN.PAYMENT_REVIEW.SUCCESS_APPROVED')
            : this.translate.instant('ADMIN.PAYMENT_REVIEW.SUCCESS_REJECTED');
          this.toastService.showSuccess(msg);
          this.closeModal();
          this.loadPayments();
        }
      },
      error: (err: any) => {
        this.reviewModal.isProcessing = false;
        this.toastService.showError(err.error?.message || this.translate.instant('ADMIN.PAYMENT_REVIEW.ERR_FAILED_PROCESS'));
      }
    });
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadPayments();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'REJECTED': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:         return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) { case 'APPROVED': return '✅'; case 'REJECTED': return '❌'; default: return '⏳'; }
  }

  get pendingCount(): number {
    return this.payments.filter(p => p.status === 'PENDING').length;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const max = 5;
    let start = Math.max(0, this.currentPage - 2);
    let end   = Math.min(this.totalPages - 1, start + max - 1);
    if (end - start < max - 1) start = Math.max(0, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}
