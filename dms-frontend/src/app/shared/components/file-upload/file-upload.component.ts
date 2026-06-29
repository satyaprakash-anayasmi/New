import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  @Input() label: string = 'Upload Image';
  @Input() currentUrl: string | null = null;
  @Output() uploadComplete = new EventEmitter<string>();

  isUploading = false;
  uploadProgress = 0;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      this.toastService.showError('File size exceeds 5MB limit.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.toastService.showError('Only image files are allowed.');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', file);

    // Simulate progress for UI
    const progressInterval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 90) clearInterval(progressInterval);
    }, 100);

    this.http.post<any>(`${environment.apiUrl}/upload`, formData).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        
        const fileUrl = environment.apiUrl.replace('/api', '') + response.data.fileUrl;
        this.currentUrl = fileUrl;
        this.uploadComplete.emit(fileUrl);
        
        setTimeout(() => {
          this.isUploading = false;
          this.toastService.showSuccess('File uploaded successfully!');
        }, 500);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isUploading = false;
        this.uploadProgress = 0;
        this.toastService.showError('Failed to upload file. Please try again.');
        console.error('Upload Error:', err);
      }
    });
  }

  removeFile() {
    this.currentUrl = null;
    this.uploadComplete.emit('');
  }
}
