import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/auth/auth.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'dms-frontend';
  username = 'User';
  roleDisplay = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) { }

  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  ngOnInit() {
    this.extractUserInfo();
  }

  extractUserInfo() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || 'User';

        let roles: string[] = [];
        if (payload.roles && Array.isArray(payload.roles)) {
          roles = payload.roles.map((r: { authority: string }) => r.authority);
        }

        // Format role nicely
        if (roles.includes('ROLE_ADMIN')) {
          this.roleDisplay = 'Admin';
        } else if (roles.includes('ROLE_REVIEWER')) {
          this.roleDisplay = 'Reviewer';
        } else if (roles.includes('ROLE_UPLOADER')) {
          this.roleDisplay = 'Uploader';
        }
      } catch (e) {
        console.error('Error parsing token for UI display', e);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
