import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { UserResponse } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}/users`;

    constructor(private readonly http: HttpClient) { }

    getReviewers(): Observable<ApiResponse<UserResponse[]>> {
        return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/reviewers`);
    }
}
