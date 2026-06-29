import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { LoggerService } from '../services/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toastService = inject(ToastService);
    const loggerService = inject(LoggerService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = error.error.message;
                loggerService.error('Client-side error:', error.error.message);
            } else {
                // Server-side error
                if (error.error && typeof error.error === 'object') {
                    if (error.error.data && typeof error.error.data === 'object' && Object.keys(error.error.data).length > 0) {
                        // Handle validation errors from backend
                        const validationErrors = Object.values(error.error.data).join(', ');
                        errorMessage = `${error.error.message || 'Validation failed'}: ${validationErrors}`;
                    } else if (error.error.message) {
                        // Standard error message from backend
                        errorMessage = error.error.message;
                    } else {
                        // Fallback generic message
                        errorMessage = `An unexpected error occurred (Code: ${error.status})`;
                    }
                } else {
                    errorMessage = `An unexpected error occurred (Code: ${error.status})`;
                }
                loggerService.error(`Server-side error [${error.status}]:`, error.error);
            }

            // Show toast if it's not a 401 (handled by auth logic) or 403 (handled by auth logic)
            if (error.status !== 401 && error.status !== 403) {
                // Only show if we have a meaningful message
                toastService.showError(errorMessage, 'Error');
            }

            return throwError(() => error);
        })
    );
};
