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

    // Table Config
    tableHeaders = [
        { label: 'Document', key: 'title' },
        { label: 'Status', key: 'status' },
        { label: 'Action', key: 'actions' }
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

    loadPendingDocuments(page: number = 0) {
        this.isLoading = true;
        this.currentPage = page;
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
        this.activeDoc = doc;
        this.comments = '';
    }

    openDocument(id: number) {
        const doc = this.documents.find(d => d.id === id);
        if (doc) {
            this.selectedDocForView = doc;
            this.showViewer = true;
        }
    }

    submitReview(action: string) {
        if (!this.activeDoc) return;
        this.reviewService.reviewDocument(this.activeDoc.id, { action, comments: this.comments }).subscribe({
            next: (res) => {
                this.toast.showSuccess(this.config.get('messages.review_success'));
                this.activeDoc = null;
                this.loadPendingDocuments();
            },
            error: (err: any) => {
                this.toast.showError(err.error?.message || this.config.get('messages.review_error'));
            }
        });
    }

    formatStatus(status: string): string {
        switch (status) {
            case 'IN_REVIEW': return 'In Review Process';
            case 'UPLOADED': return 'Waiting for Review';
            default: return status;
        }
    }
}
