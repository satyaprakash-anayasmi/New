import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { DocumentResponse } from '../../shared/models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
    private readonly apiUrl = `${environment.apiUrl}/documents`;
    constructor(private readonly http: HttpClient) { }

    uploadDocument(file: File, title: string): Observable<ApiResponse<DocumentResponse>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/upload`, formData);
    }

    getAllDocuments(): Observable<ApiResponse<DocumentResponse[]>> {
        return this.http.get<ApiResponse<DocumentResponse[]>>(this.apiUrl);
    }

    getDocumentById(id: number): Observable<ApiResponse<DocumentResponse>> {
        return this.http.get<ApiResponse<DocumentResponse>>(`${this.apiUrl}/${id}`);
    }

    downloadDocument(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
    }
}
