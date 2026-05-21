import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfigService } from '../../core/services/config.service';
import { DocumentResponse } from '../../shared/models/document.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-review',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './review.component.html'
})
export class ReviewComponent implements OnInit {
    documents: DocumentResponse[] = [];
    isLoading = false;
    activeDoc: DocumentResponse | null = null;
    comments = '';
    readonly text = this.config.text;

    constructor(
        private readonly documentService: DocumentService,
        private readonly reviewService: ReviewService,
        private readonly toast: ToastService,
        private readonly config: ConfigService
    ) { }

    ngOnInit() {
        this.loadPendingDocuments();
    }

    loadPendingDocuments() {
        this.isLoading = true;
        this.documentService.getAllDocuments().subscribe({
            next: (res) => {
                if (res.success) {
                    this.documents = res.data.filter((doc) => doc.status === 'IN_REVIEW' || doc.status === 'UPLOADED');
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
