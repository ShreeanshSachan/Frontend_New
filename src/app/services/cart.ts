import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CartResponse {
  userId: number;
  totalPrice: number;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private api = inject(ApiService);

  getCart(): Observable<CartResponse> {
    return this.api.get<CartResponse>('/cart');
  }

  addItem(productId: number, quantity: number): Observable<string> {
    return this.api.post<string>('/cart/add', { productId, quantity });
  }

  updateItem(productId: number, quantity: number): Observable<string> {
    return this.api.put<string>('/cart/update', { productId, quantity });
  }

  removeItem(productId: number): Observable<string> {
    return this.api.delete<string>(`/cart/${productId}`);
  }

  clearCart(): Observable<string> {
    return this.api.delete<string>('/cart/clear');
  }
}
