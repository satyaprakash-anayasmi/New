import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfigService } from '../../core/services/config.service';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './upload.component.html'
})
export class UploadComponent {
    docTitle = '';
    file: File | null = null;
    readonly text = this.config.text;

    constructor(
        private readonly documentService: DocumentService,
        private readonly toast: ToastService,
        private readonly config: ConfigService
    ) { }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.file = input.files[0];
        }
    }

    upload() {
        if (!this.file) {
            this.toast.showWarning(this.config.get('messages.file_required'));
            return;
        }
        if (!this.docTitle) {
            this.toast.showWarning(this.config.get('messages.title_required'));
            return;
        }

        this.documentService.uploadDocument(this.file, this.docTitle).subscribe({
            next: (res) => {
                this.toast.showSuccess(this.config.get('messages.upload_success'));
                this.docTitle = '';
                this.file = null;
            },
            error: (err) => {
                this.toast.showError(err.error?.message || this.config.get('messages.upload_error'));
            }
        });
    }
}
