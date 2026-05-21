import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data?.accessToken) {
          localStorage.setItem('access_token', response.data.accessToken);
          // Optional: decode roles and store them in memory/state
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    globalThis.location.reload();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
