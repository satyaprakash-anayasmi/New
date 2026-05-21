import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuditService {
    private readonly apiUrl = `${environment.apiUrl}/logs`;
    constructor(private readonly http: HttpClient) { }

    getAuditLogs(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(this.apiUrl);
    }
}
