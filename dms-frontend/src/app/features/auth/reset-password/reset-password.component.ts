import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  data = {
    identifier: '',
    method: 'EMAIL',
    otpCode: '',
    newPassword: '',
    confirmPassword: ''
  };
  isLoading = false;
  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.data.identifier = this.route.snapshot.queryParamMap.get('identifier') || '';
    this.data.method = this.route.snapshot.queryParamMap.get('method') || 'EMAIL';
    
    if (!this.data.identifier) {
      this.toastService.showError('No identifier provided for password reset');
      this.router.navigate(['/forgot-password']);
    }
  }

  onSubmit() {
    if (this.data.otpCode.length !== 6) {
      this.toastService.showError('Please enter a valid 6-digit OTP');
      return;
    }
    if (this.data.newPassword.length < 6) {
      this.toastService.showError('Password must be at least 6 characters long');
      return;
    }
    if (this.data.newPassword !== this.data.confirmPassword) {
      this.toastService.showError('Passwords do not match');
      return;
    }

    this.isLoading = true;
    const { confirmPassword, ...resetData } = this.data;

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.showSuccess('Password reset successfully!');
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.showError(error.error?.message || 'An error occurred during password reset');
      }
    });
  }
}
