import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentResponse } from '../../models/document.model';
import { DocumentService } from '../../../core/services/document.service';
import { ToastService } from '../../../core/services/toast.service';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show = false;
  @Input() document: DocumentResponse | null = null;
  @Output() closeViewer = new EventEmitter<void>();

  @ViewChild('viewerDialog') set viewerDialog(ref: ElementRef<HTMLDialogElement>) {
    if (ref && !ref.nativeElement.open) {
      ref.nativeElement.showModal();
    }
  }

  loading = false;
  previewUrl: SafeResourceUrl | SafeUrl | null = null;
  isImage = false;
  errorMsg = '';
  private objectUrl: string | null = null;

  constructor(
    private readonly documentService: DocumentService,
    private readonly sanitizer: DomSanitizer,
    private readonly toast: ToastService
  ) { }

  ngOnInit() {
    if (this.show && this.document) {
      this.loadPreview();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const showTrue = changes['show']?.currentValue === true;
    const docChanged = changes['document'] && !changes['document'].firstChange;

    if ((showTrue || (this.show && docChanged)) && this.document) {
      this.loadPreview();
    }
  }

  loadPreview() {
    if (!this.document) return;
    this.loading = true;
    this.previewUrl = null;
    this.errorMsg = '';

    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif'].includes(this.document.fileType.toLowerCase());

    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    this.documentService.downloadDocument(this.document.id).subscribe({
      next: (blob: Blob) => {
        this.objectUrl = URL.createObjectURL(blob);
        if (this.objectUrl?.startsWith('blob:')) {
          /**
           * SECURITY RATIONALE:
           * We bypass Angular's built-in sanitization for this 'blob:' URL because:
           * 1. ORIGIN: The URL is generated locally from a Blob, not an external string.
           * 2. TRUST: The Blob data originates from our own secure/authenticated API.
           * 3. ISOLATION: The <iframe> in the template uses a strict 'sandbox' attribute 
           *    WITHOUT 'allow-scripts' or 'allow-same-origin', neutralizing any 
           *    potential malicious payload embedded in the document.
           */
          this.previewUrl = this.isImage
            ? this.sanitizer.bypassSecurityTrustUrl(this.objectUrl)
            : this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Failed to load preview data';
      }
    });
  }

  onClose() {
    this.closeViewer.emit();
  }

  ngOnDestroy() {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  downloadRequested() {
    if (!this.document) return;
    this.loading = true;

    // Get current token from storage
    const token = localStorage.getItem('access_token');

    /**
     * MOBILE COMPATIBILITY STRATEGY:
     * Construct the direct local download URL with token for mobile browser handoff.
     * This avoids 'spinning' issues by handing the download stream to the system's 
     * native download manager (Chrome/Safari) which is 100% reliable.
     */
    const downloadUrl = `${environment.apiUrl}/documents/${this.document.id}/download?token=${token}`;

    // Hand off to system browser
    const win = globalThis.open(downloadUrl, '_blank');

    if (!win) {
      this.toast.showError('Please allow popups to download files');
    } else {
      this.toast.showSuccess('Download started in browser');
    }

    // Stop the local loader as the external browser is now handling the stream
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

  formatSize(bytes?: number) {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    return kb > 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(2) + ' KB';
  }
}
