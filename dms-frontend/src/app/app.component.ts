import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/auth/auth.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { filter } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalizePipe } from './shared/pipes/localize.pipe';
import { LoggerService } from './core/services/logger.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent, BreadcrumbComponent, TranslateModule, LocalizePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'smart-bazar';
  username = 'User';
  roleDisplay = '';
  sidebarOpen = false;
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    public readonly translate: TranslateService,
    private readonly logger: LoggerService
  ) {
    const savedLang = localStorage.getItem('app_lang') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);

    // Show loading overlay on route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => { this.isLoading = false; }, 300);
      }
    });

    // Close sidebar on mobile after navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sidebarOpen = false;
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get isLoginPage(): boolean {
    const publicRoutes = ['/login', '/welcome', '/', '/register', '/forgot-password', '/reset-password'];
    return publicRoutes.includes(this.router.url.split('?')[0]);
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
          roles = payload.roles.map((r: any) => r.authority || r);
        }

        // Format role nicely — values must match COMMON.ROLES keys in i18n files
        if (roles.includes('ROLE_ADMIN')) {
          this.roleDisplay = 'ADMINISTRATOR';
        } else if (roles.includes('ROLE_REVIEWER')) {
          this.roleDisplay = 'REVIEWER';
        } else if (roles.includes('ROLE_DEALER')) {
          this.roleDisplay = 'DEALER';
        } else if (roles.includes('ROLE_UPLOADER')) {
          this.roleDisplay = 'MEMBER';
        }
      } catch (e) {
        this.logger.error('Error parsing token for UI display', e);
      }
    }
  }

  isLangDropdownOpen = false;
  dropdownStyle: { [key: string]: string } = {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isLangDropdownOpen = false;
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onWindowResizeOrScroll() {
    this.isLangDropdownOpen = false;
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
    if (this.isLangDropdownOpen) {
      const button = (event.currentTarget || event.target) as HTMLElement;
      const rect = button.getBoundingClientRect();
      const dropdownWidth = 176; // w-44 = 176px
      
      // Calculate top and left relative to the viewport
      const top = rect.bottom + 8;
      const left = rect.right - dropdownWidth;
      
      this.dropdownStyle = {
        top: `${top}px`,
        left: `${left}px`
      };
    }
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('app_lang', lang);
    this.isLangDropdownOpen = false;
  }

  getActiveLangFlag(): string {
    const lang = this.translate.currentLang || 'en';
    if (lang === 'or' || lang === 'te' || lang === 'hi') return '🇮🇳';
    return '🇬🇧';
  }

  getActiveLangName(): string {
    const lang = this.translate.currentLang || 'en';
    if (lang === 'or') return 'ଓଡ଼ିଆ';
    if (lang === 'te') return 'తెలుగు';
    if (lang === 'hi') return 'हिन्दी';
    return 'English';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
