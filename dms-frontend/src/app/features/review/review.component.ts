import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfigService } from '../../core/services/config.service';
import { DocumentResponse } from '../../shared/models/document.model';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { DocumentViewerComponent } from '../../shared/components/document-viewer/document-viewer.component';

@Component({
    selector: 'app-review',
    standalone: true,
    imports: [CommonModule, FormsModule, DataTableComponent, DocumentViewerComponent],
    templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit {
    documents: DocumentResponse[] = [];
    isLoading = false;
    activeDoc: DocumentResponse | null = null;
    comments = '';
    readonly text = this.config.text;
    selectedDocForView: DocumentResponse | null = null;
    showViewer = false;

    // Selection for Multi-select
    selectedDocuments: DocumentResponse[] = [];
    selectedAction: 'APPROVE' | 'REJECT' | null = null;

    // Table Config
    tableHeaders = [
        { label: 'Document', key: 'title' },
        { label: 'Owner', key: 'uploaderUsername', type: 'user' },
        { label: 'Status', key: 'status', type: 'status' }
    ];

    // Pagination properties
    currentPage = 0;
    pageSize = 5;
    totalElements = 0;
    totalPages = 0;
    isLast = false;

    constructor(
        private readonly documentService: DocumentService,
        private readonly reviewService: ReviewService,
        private readonly toast: ToastService,
        private readonly config: ConfigService
    ) { }

    ngOnInit() {
        this.loadPendingDocuments(0);
    }

    onPageSizeChange(newSize: number) {
        this.pageSize = newSize;
        this.loadPendingDocuments(0);
    }

    onSelectionChange(selected: DocumentResponse[]) {
        this.selectedDocuments = selected;

        // Auto-focus the last selected item if nothing is active
        if (selected.length > 0 && !this.activeDoc) {
            this.activeDoc = selected.at(-1) || null;
        }

        // If activeDoc is deselected, clear it or pick another from selected
        if (this.activeDoc && !selected.some(s => s.id === this.activeDoc?.id)) {
            this.activeDoc = selected.length > 0 ? selected[0] : null;
        }
    }

    loadPendingDocuments(page: number = 0) {
        this.isLoading = true;
        this.currentPage = page;
        this.selectedDocuments = [];
        this.activeDoc = null;
        this.documentService.getPagedDocuments(page, this.pageSize, ['UPLOADED', 'IN_REVIEW']).subscribe({
            next: (res) => {
                if (res.success && res.data) {
                    this.documents = res.data.content;
                    this.totalElements = res.data.totalElements;
                    this.totalPages = res.data.totalPages;
                    this.isLast = res.data.last;
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                if (err.status !== 401 && err.status !== 403) {
                    this.toast.showError(this.config.get('messages.load_error'));
                }
            }
        });
    }

    selectDocument(doc: DocumentResponse) {
        // Toggle behavior for clicking rows
        const index = this.selectedDocuments.findIndex(s => s.id === doc.id);

        if (this.activeDoc?.id === doc.id) {
            this.activeDoc = null;
            if (index > -1) {
                this.selectedDocuments.splice(index, 1);
                this.selectedDocuments = [...this.selectedDocuments];
            }
        } else {
            this.activeDoc = doc;
            this.comments = '';
            this.selectedAction = null;
            if (index === -1) {
                this.selectedDocuments = [...this.selectedDocuments, doc];
            }
        }
    }

    toggleAction(action: 'APPROVE' | 'REJECT') {
        // Toggle behavior: If clicking same action, deselect. If other, switch to it.
        this.selectedAction = this.selectedAction === action ? null : action;
    }

    openDocument(id: number) {
        const doc = this.documents.find(d => d.id === id);
        if (doc) {
            this.selectedDocForView = doc;
            this.showViewer = true;
        }
    }

    submitReview() {
        if (!this.activeDoc || !this.selectedAction) return;
        this.reviewService.reviewDocument(this.activeDoc.id, { action: this.selectedAction, comments: this.comments }).subscribe({
            next: (res) => {
                this.toast.showSuccess(this.config.get('messages.review_success'));
                this.activeDoc = null;
                this.selectedAction = null;
                this.loadPendingDocuments();
            },
            error: (err: any) => {
                this.toast.showError(err.error?.message || this.config.get('messages.review_error'));
            }
        });
    }

    submitBulkReview(action: 'APPROVE' | 'REJECT') {
        if (this.selectedDocuments.length === 0) return;

        // Simulating batch request by iterating (ideally backend would have a batch endpoint)
        const requests = this.selectedDocuments.map(doc =>
            this.reviewService.reviewDocument(doc.id, { action, comments: 'Bulk processed via administrative console.' })
        );

        this.isLoading = true;
        // Basic implementation for demonstration
        let completed = 0;
        let success = 0;

        requests.forEach(req => {
            req.subscribe({
                next: () => {
                    success++;
                    completed++;
                    if (completed === requests.length) this.onBulkFinished(success);
                },
                error: () => {
                    completed++;
                    if (completed === requests.length) this.onBulkFinished(success);
                }
            });
        });
    }

    private onBulkFinished(successCount: number) {
        this.isLoading = false;
        this.toast.showSuccess(`Successfully processed ${successCount} documents.`);
        this.selectedDocuments = [];
        this.loadPendingDocuments();
    }

    formatStatus(status: string): string {
        switch (status) {
            case 'IN_REVIEW': return 'In Review Process';
            case 'UPLOADED': return 'Waiting for Review';
            default: return status;
        }
    }
}
