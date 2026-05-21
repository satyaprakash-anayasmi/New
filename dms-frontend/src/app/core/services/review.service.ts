import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
    private readonly apiUrl = `${environment.apiUrl}/reviews`;
    constructor(private readonly http: HttpClient) { }

    assignReviewer(documentId: number, reviewerId: number): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${documentId}/assign/${reviewerId}`, {});
    }

    reviewDocument(documentId: number, request: { action: string; comments: string }): Observable<ApiResponse<void>> {
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${documentId}/review`, request);
    }
}
