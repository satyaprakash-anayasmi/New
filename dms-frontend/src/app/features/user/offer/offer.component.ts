import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  growthPlan: any = null;
  isLoading = true;
  isProcessing = false;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'APPROVED' | 'REJECTED' | null = null;
  purchaseHistory: any[] = [];

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlan();
    this.loadMyPayment();
  }

  loadPlan(): void {
    this.isLoading = true;
    this.api.getPlans().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data && res.data.length > 0) {
          // Assume the ₹2000 Growth Plan is the primary active plan
          this.growthPlan = res.data.find((p: any) => p.active) || res.data[0];
        }
      },
      error: () => {
        this.isLoading = false;
        this.toast.showError('Failed to load growth plan offers');
      }
    });
  }

  loadMyPayment(): void {
    this.api.getMyPayment().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.purchaseHistory = [res.data];
          this.paymentStatus = res.data.status;
        }
      }
    });
  }

  purchasePlan(): void {
    if (!this.growthPlan) return;
    this.isProcessing = true;
    
    // Simulate Razorpay/Payment gateway process
    // First create order
    this.api.createOrder(this.growthPlan.id).subscribe({
      next: (orderRes) => {
        if (orderRes.success) {
          // Submit payment success directly for simulation
          const payload = {
            subscriptionPlanId: this.growthPlan.id,
            amount: this.growthPlan.price,
            paymentMethod: 'ONLINE_TRANSFER',
            transactionReference: 'TXN-' + Math.floor(Math.random() * 1000000),
            remarks: 'Growth Plan Subscription'
          };

          this.api.submitPayment(payload).subscribe({
            next: (submitRes) => {
              this.isProcessing = false;
              if (submitRes.success) {
                this.toast.showSuccess('Payment Successful! You are now Basic Level 1.');
                this.paymentStatus = 'SUCCESS';
                this.loadMyPayment();
              } else {
                this.paymentStatus = 'FAILED';
                this.toast.showError('Payment failed to process');
              }
            },
            error: () => {
              this.isProcessing = false;
              this.paymentStatus = 'FAILED';
              this.toast.showError('Payment submission failed');
            }
          });
        }
      },
      error: () => {
        this.isProcessing = false;
        this.toast.showError('Failed to initiate purchase');
      }
    });
  }
}
