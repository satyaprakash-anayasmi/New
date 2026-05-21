import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

import { ToastService } from '../../../core/services/toast.service';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  isLoading = false;
  showPassword = false;
  readonly text = this.config.text;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService,
    private readonly config: ConfigService
  ) { }

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.toast.showWarning('Please enter both username and password', 'Validation Error');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.toast.showSuccess(this.config.get('messages.login_success'));
          this.router.navigate(['/dashboard']).then(() => {
            globalThis.location.reload();
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError(err.error?.message || this.config.get('messages.login_error'));
      }
    });
  }
}
