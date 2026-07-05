import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PaymentRequest {
  orderId: number;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = inject(ApiService);

  processPayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.api.post<PaymentResponse>('/payments/process', request);
  }

  getPaymentByOrder(orderId: number): Observable<PaymentResponse> {
    return this.api.get<PaymentResponse>(`/payments/${orderId}`);
  }

  getUserPayments(): Observable<PaymentResponse[]> {
    return this.api.get<PaymentResponse[]>('/payments/user');
  }
}
