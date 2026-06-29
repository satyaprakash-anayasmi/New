import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { ApiService } from './api.service';

// ── Models ─────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  features: string[];
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;        // in rupees (multiply by 100 for Razorpay SDK)
  currency: string;
  keyId: string;
  planId: number;
  planName: string;
}

export interface PaymentRequest {
  subscriptionPlanId: number;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  remarks?: string;
}

export interface PaymentRecord {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  remarks: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminRemarks: string;
  submittedAt: string;
  reviewedAt: string;
  reviewedBy: string;
  planName?: string;
  planId?: number;
}

// ── Service ─────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private readonly apiService: ApiService) {}

  // ── Subscription Plans ──────────────────────────────────────────────────

  /** Fetch all available subscription plans */
  getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.apiService.getPlans();
  }

  // ── Razorpay Order ──────────────────────────────────────────────────────

  /** Create a Razorpay order for the selected plan */
  createOrder(planId: number): Observable<ApiResponse<RazorpayOrderResponse>> {
    return this.apiService.createOrder(planId);
  }

  // ── Payment Submission ───────────────────────────────────────────────────

  /** Submit a payment record (after Razorpay callback OR manual) */
  submitPayment(payload: PaymentRequest): Observable<ApiResponse<PaymentRecord>> {
    return this.apiService.submitPayment(payload);
  }

  /** Get the current user's latest payment record */
  getMyPayment(): Observable<ApiResponse<PaymentRecord>> {
    return this.apiService.getMyPayment();
  }

  // ── Admin ────────────────────────────────────────────────────────────────

  /** Admin: List all payments, filtered by status */
  getAllPayments(status = 'ALL', page = 0, size = 10): Observable<ApiResponse<any>> {
    return this.apiService.getAllPayments(status, page, size);
  }

  /** Admin: Approve a payment */
  approvePayment(paymentId: number, adminRemarks?: string): Observable<ApiResponse<PaymentRecord>> {
    return this.apiService.approvePayment(paymentId, adminRemarks);
  }

  /** Admin: Reject a payment */
  rejectPayment(paymentId: number, adminRemarks?: string): Observable<ApiResponse<PaymentRecord>> {
    return this.apiService.rejectPayment(paymentId, adminRemarks);
  }
}
