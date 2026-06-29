import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  identifier = '';
  method: 'EMAIL' | 'PHONE' = 'EMAIL';
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly router: Router
  ) { }

  onSubmit() {
    if (this.method === 'EMAIL' && !this.identifier.includes('@')) {
      this.toastService.showError('Please enter a valid email address');
      return;
    }
    if (this.method === 'PHONE' && this.identifier.length < 10) {
      this.toastService.showError('Please enter a valid phone number');
      return;
    }

    this.isLoading = true;
    this.authService.forgotPassword(this.identifier, this.method).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.showSuccess('Reset code sent successfully');
          this.router.navigate(['/reset-password'], { queryParams: { identifier: this.identifier, method: this.method } });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.showError(error.error?.message || 'Failed to send reset code');
      }
    });
  }
}
