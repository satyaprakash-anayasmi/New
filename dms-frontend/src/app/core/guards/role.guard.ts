import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private readonly router: Router, private readonly logger: LoggerService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        const expectedRoles = route.data['roles'] as Array<string>;
        const token = localStorage.getItem('access_token');

        if (!token) {
            this.router.navigate(['/welcome']);
            return false;
        }

        try {
            // Decode JWT token payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            let userRoles: string[] = [];

            // Standard spring boot JWT structure parsing
            if (payload.roles && Array.isArray(payload.roles)) {
                userRoles = payload.roles.map((r: any) => r.authority || r);
            }

            if (expectedRoles && !expectedRoles.some(role => userRoles.includes(role))) {
                this.router.navigate(['/home']);
                return false;
            }
            return true;
        } catch (error) {
            this.logger.error('Error decoding token:', error);
            this.router.navigate(['/welcome']);
            return false;
        }
    }
}
