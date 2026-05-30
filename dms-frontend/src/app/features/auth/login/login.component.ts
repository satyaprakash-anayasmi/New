import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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
    private readonly config: ConfigService,
    private readonly http: HttpClient
  ) { }

  onSubmit() {
    // Fallback: Read directly from DOM to handle autofill/password manager issues
    const userEl = document.getElementById('usernameInput') as HTMLInputElement;
    const passEl = document.getElementById('passwordInput') as HTMLInputElement;

    if (userEl && !this.credentials.username) this.credentials.username = userEl.value;
    if (passEl && !this.credentials.password) this.credentials.password = passEl.value;

    const username = this.credentials.username?.trim();
    const password = this.credentials.password?.trim();

    if (!username || !password) {
      if (!this.isLoading) {
        this.toast.showWarning('Please enter both username and password', 'Validation Error');
      }
      return;
    }

    this.isLoading = true;
    this.credentials.username = username;
    this.credentials.password = password;

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
        console.error('Login error detail:', err);

        if (err.status === 0) {
          this.toast.showError('Cannot connect to server. Please check your network and API URL.', 'Network Error');
        } else if (err.status === 401) {
          this.toast.showError(this.config.get('messages.login_error'), 'Login Failed');
        } else {
          this.toast.showError(err.error?.message || 'An unexpected error occurred', 'Error');
        }
      }
    });
  }
}
