import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface OrderRequest {
  productId: number;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  userName: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private api = inject(ApiService);

  createOrder(request: OrderRequest): Observable<OrderResponse> {
    return this.api.post<OrderResponse>('/orders', request);
  }

  getMyOrders(): Observable<OrderResponse[]> {
    return this.api.get<OrderResponse[]>('/orders/my');
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.api.get<OrderResponse>(`/orders/${id}`);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.api.get<OrderResponse[]>('/orders');
  }

  updateOrderStatus(orderId: number, status: string): Observable<OrderResponse> {
    return this.api.put<OrderResponse>(`/orders/${orderId}/status`, { status });
  }
}
