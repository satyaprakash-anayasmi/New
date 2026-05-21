import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menus = [
    { label: 'Dashboard', path: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER', 'ROLE_REVIEWER'] },
    { label: 'Upload Document', path: '/docs/upload', roles: ['ROLE_ADMIN', 'ROLE_UPLOADER'] },
    { label: 'Review Queue', path: '/reviews/pending', roles: ['ROLE_ADMIN', 'ROLE_REVIEWER'] },
    { label: 'Assign Document', path: '/admin/assign', roles: ['ROLE_ADMIN'] }
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
        if (payload.roles && Array.isArray(payload.roles)) {
          userRoles = payload.roles.map((r: any) => r.authority);
        }
      } catch (error) {
        console.error('Error parsing token in sidebar:', error);
      }
    }
    // If no roles, we can show an empty menu, or we check if userRoles has any overlapping roles
    this.allowedMenus = this.menus.filter(m => m.roles.some(role => userRoles.includes(role)));
  }
}
