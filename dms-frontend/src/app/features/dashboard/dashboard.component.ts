import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../core/services/document.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfigService } from '../../core/services/config.service';
import { DocumentResponse } from '../../shared/models/document.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  documents: DocumentResponse[] = [];
  isLoading = false;
  userProfile = { username: '', role: '' };
  readonly text = this.config.text;

  constructor(
    private readonly documentService: DocumentService,
    private readonly toast: ToastService,
    private readonly config: ConfigService
  ) { }

  ngOnInit() {
    this.extractUserProfile();
    this.loadDocuments();
  }

  extractUserProfile() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userProfile.username = payload.sub || 'Unknown User';
        if (payload.roles && payload.roles.length > 0) {
          const role = payload.roles[0].authority;
          if (role === 'ROLE_ADMIN') this.userProfile.role = 'Administrator';
          else if (role === 'ROLE_REVIEWER') this.userProfile.role = 'Reviewer';
          else if (role === 'ROLE_UPLOADER') this.userProfile.role = 'Uploader';
        }
      } catch (e) {
        console.warn('Failed to parse user profile from token', e);
      }
    }
  }

  openDocument(id: number) {
    this.documentService.downloadDocument(id).subscribe({
      next: (blob) => {
        const url = globalThis.URL.createObjectURL(blob);
        globalThis.open(url, '_blank');
        setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000);
      },
      error: (err) => {
        this.toast.showError('Could not open document. It might be missing from storage.');
      }
    });
  }

  loadDocuments() {
    this.isLoading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (res) => {
        if (res.success) {
          this.documents = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        // Don't show toast if we're unauthorized, the interceptor handles the redirect
        if (err.status !== 401 && err.status !== 403) {
          this.toast.showError(this.config.get('messages.load_error'));
        }
      }
    });
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'IN_REVIEW': return 'In Review Process';
      case 'APPROVED': return 'Approved';
      case 'REJECTED': return 'Rejected';
      case 'UPLOADED': return 'Recently Uploaded';
      default: return status;
    }
  }
}
