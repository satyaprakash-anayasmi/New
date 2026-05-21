import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { UserService } from '../../core/services/user.service';
import { ReviewService } from '../../core/services/review.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfigService } from '../../core/services/config.service';
import { UserResponse } from '../../shared/models/user.model';
import { DocumentResponse } from '../../shared/models/document.model';

@Component({
    selector: 'app-assignment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './assignment.component.html'
})
export class AssignmentComponent implements OnInit {
    documents: DocumentResponse[] = [];
    reviewers: UserResponse[] = [];
    isLoading = false;
    selectedDoc: DocumentResponse | null = null;
    selectedReviewerId: number | null = null;
    readonly text = this.config.text;

    constructor(
        private readonly documentService: DocumentService,
        private readonly userService: UserService,
        private readonly reviewService: ReviewService,
        private readonly toast: ToastService,
        private readonly config: ConfigService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this.documentService.getAllDocuments().subscribe({
            next: (res) => {
                if (res.success) {
                    this.documents = res.data.filter((doc) => doc.status === 'UPLOADED');
                }
                this.isLoading = false;
            },
            error: (err: any) => {
                this.isLoading = false;
                if (err.status !== 401 && err.status !== 403) {
                    this.toast.showError(this.config.get('messages.load_error'));
                }
            }
        });

        this.userService.getReviewers().subscribe({
            next: (res) => {
                if (res.success) {
                    this.reviewers = res.data;
                }
            }
        });
    }

    selectDocument(doc: DocumentResponse) {
        this.selectedDoc = doc;
        this.selectedReviewerId = null;
    }

    assignDocument() {
        if (!this.selectedDoc || !this.selectedReviewerId) return;

        this.reviewService.assignReviewer(this.selectedDoc.id, this.selectedReviewerId).subscribe({
            next: (res) => {
                this.toast.showSuccess(this.config.get('messages.assign_success'));
                this.selectedDoc = null;
                this.loadData();
            },
            error: (err) => {
                this.toast.showError(err.error?.message || this.config.get('messages.assign_error'));
            }
        });
    }

    formatStatus(status: string): string {
        return status === 'UPLOADED' ? 'Waiting for Assignment' : status;
    }
}
