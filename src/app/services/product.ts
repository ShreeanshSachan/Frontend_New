import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = inject(ApiService);

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>('/products');
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.api.get<Product[]>(`/products/category/${category}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.api.post<Product>('/products', product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<string> {
    return this.api.delete<string>(`/products/${id}`);
  }
}
