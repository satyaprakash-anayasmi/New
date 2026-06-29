import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuditService {
    constructor(private readonly apiService: ApiService) { }

    getAuditLogs(): Observable<ApiResponse<any[]>> {
        return this.apiService.getAuditLogs();
    }
}
