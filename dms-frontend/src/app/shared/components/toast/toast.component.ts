import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  activeToasts: ToastMessage[] = [];
  private subscription: Subscription | undefined;

  constructor(private readonly toastService: ToastService) { }

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toast => {
      this.activeToasts.push(toast);
      if (toast.id) {
        setTimeout(() => this.remove(toast.id!), 5000);
      }
    });
  }

  remove(id: number) {
    this.activeToasts = this.activeToasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
