import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  constructor(private readonly logger: LoggerService) { }

  isActive = true;   // true = account is active, false = payment pending
  isAdmin = false;

  menus = [
    { label: 'NAV.HOME', path: '/home', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'home', requiresActive: false },
    { label: 'NAV.PROFILE', path: '/profile', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'profile', requiresActive: false },
    { label: 'NAV.PAYMENT', path: '/payment', roles: ['ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'credit-card', requiresActive: false },
    { label: 'NAV.DASHBOARD', path: '/dashboard', roles: ['ROLE_ADMIN'], icon: 'grid', requiresActive: false },
    { label: 'NAV.FACILITIES', path: '/facilities', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'star', requiresActive: true },
    { label: 'NAV.GROWTH_PLAN', path: '/description', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'network', requiresActive: true },
    { label: 'NAV.REFERRAL_TREE', path: '/referral-tree', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'], icon: 'tree', requiresActive: false },
    { label: 'NAV.USER_REQUESTS', path: '/admin/registrations', roles: ['ROLE_ADMIN'], icon: 'users', requiresActive: false },
    { label: 'NAV.APPROVED_USERS', path: '/admin/users', roles: ['ROLE_ADMIN'], icon: 'user-check', requiresActive: false },
    { label: 'NAV.PAYMENT_REVIEW', path: '/admin/payments', roles: ['ROLE_ADMIN'], icon: 'wallet', requiresActive: false },
    { label: 'NAV.MASTER_MGMT', path: '/admin/masters', roles: ['ROLE_ADMIN'], icon: 'settings', requiresActive: false },
    { label: 'NAV.DEALER_MANAGEMENT', path: '/admin/dealer-management', roles: ['ROLE_ADMIN', 'ROLE_DEALER', 'Dealer'], icon: 'briefcase', requiresActive: false },
    { label: 'NAV.DEALER_AREA_ASSIGNMENT', path: '/admin/dealer-area-assignment', roles: ['ROLE_ADMIN', 'ROLE_DEALER', 'Dealer'], icon: 'map', requiresActive: false },
    { label: 'NAV.SCREEN_ASSIGNMENT', path: '/admin/screen-assignment', roles: ['ROLE_ADMIN'], icon: 'desktop', requiresActive: false },
  ];

  allowedMenus: any[] = [];

  ngOnInit() {
    this.filterMenus();
  }

  filterMenus() {
    const token = localStorage.getItem('access_token');
    let userRoles: string[] = [];

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload?.roles && Array.isArray(payload.roles)) {
          userRoles = payload.roles.map((r: any) => r.authority || r);
        }

        // Read isActive from JWT claim (default true for admin / legacy tokens)
        this.isAdmin = userRoles.includes('ROLE_ADMIN');
        this.isActive = this.isAdmin ? true : (payload.isActive !== false);

      } catch (error) {
        this.logger.error('Error parsing token in sidebar:', error);
      }
    }

    this.allowedMenus = this.menus.filter(m => {
      const roleMatch = m.roles.some(role => userRoles.includes(role));
      if (!roleMatch) return false;
      // Hide items that require an active account when user is inactive
      if (m.requiresActive && !this.isActive) return false;
      return true;
    });
  }
}
