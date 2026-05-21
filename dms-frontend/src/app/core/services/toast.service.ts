import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
    id?: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly toastSubject = new Subject<ToastMessage>();
    readonly toasts$ = this.toastSubject.asObservable();

    showSuccess(message: string, title: string = 'Success') {
        this.show({ type: 'success', message, title });
    }

    showError(message: string, title: string = 'Error') {
        this.show({ type: 'error', message, title });
    }

    showWarning(message: string, title: string = 'Warning') {
        this.show({ type: 'warning', message, title });
    }

    showInfo(message: string, title: string = 'Info') {
        this.show({ type: 'info', message, title });
    }

    private show(toast: ToastMessage) {
        const id = Date.now();
        this.toastSubject.next({ ...toast, id });
        setTimeout(() => this.remove(id), 5000);
    }

    private remove(id: number) {
        // Implementation for removal
    }
}
