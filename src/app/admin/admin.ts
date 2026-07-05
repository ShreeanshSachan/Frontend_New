import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth';
import { ProductService, Product } from '../services/product';
import { OrderService, OrderResponse } from '../services/order';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private auth = inject(AuthService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  activeTab: 'products' | 'orders' | 'users' = 'products';

  // products
  products: Product[] = [];
  showAddForm = false;
  newProduct: Partial<Product> = { name: '', price: 0, brand: '', category: '', description: '', imageUrl: '' };
  productMsg = '';

  // orders
  orders: OrderResponse[] = [];
  orderMsg = '';
  statusOptions = ['CREATED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // users
  users: User[] = [];
  userMsg = '';

  ngOnInit(): void {
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadProducts();
    this.loadOrders();
    this.loadUsers();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: () => (this.productMsg = 'Failed to load products'),
    });
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => (this.orders = data),
      error: () => (this.orderMsg = 'Failed to load orders'),
    });
  }

  loadUsers(): void {
    this.auth.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: () => (this.userMsg = 'Failed to load users'),
    });
  }

  addProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price) {
      this.productMsg = 'Name and price are required';
      return;
    }
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.productMsg = 'Product added';
        this.showAddForm = false;
        this.newProduct = { name: '', price: 0, brand: '', category: '', description: '', imageUrl: '' };
        this.loadProducts();
      },
      error: () => (this.productMsg = 'Failed to add product'),
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.productMsg = 'Product deleted';
        this.loadProducts();
      },
      error: () => (this.productMsg = 'Failed to delete product'),
    });
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.orderMsg = `Order #${orderId} updated to ${status}`;
        this.loadOrders();
      },
      error: () => (this.orderMsg = 'Failed to update order'),
    });
  }
}
