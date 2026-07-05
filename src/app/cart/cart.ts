import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartResponse, CartItem } from '../services/cart';
import { OrderService } from '../services/order';
import { ProductService, Product } from '../services/product';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private router = inject(Router);

  cart: CartResponse = { userId: 0, totalPrice: 0, items: [] };
  productMap: Map<number, Product> = new Map();
  message = '';
  ordering = false;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loadProductDetails();
      },
      error: () => (this.message = 'Please login to view your cart'),
    });
  }

  loadProductDetails(): void {
    for (const item of this.cart.items) {
      this.productService.getById(item.productId).subscribe({
        next: (product) => this.productMap.set(product.id, product),
      });
    }
  }

  getProductName(productId: number): string {
    return this.productMap.get(productId)?.name || `Product #${productId}`;
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.message = 'Item removed';
        this.loadCart();
      },
      error: () => (this.message = 'Failed to remove item'),
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = { userId: 0, totalPrice: 0, items: [] };
        this.message = 'Cart cleared';
      },
      error: () => (this.message = 'Failed to clear cart'),
    });
  }

  checkout(): void {
    if (this.cart.items.length === 0) return;
    this.ordering = true;
    this.message = '';

    const orderIds: number[] = [];
    let completed = 0;

    for (const item of this.cart.items) {
      this.orderService.createOrder({
        productId: item.productId,
        quantity: item.quantity,
      }).subscribe({
        next: (order) => {
          orderIds.push(order.orderId);
          completed++;
          if (completed === this.cart.items.length) {
            this.cartService.clearCart().subscribe();
            this.router.navigate(['/checkout'], {
              state: { orderIds, totalAmount: this.cart.totalPrice },
            });
          }
        },
        error: () => {
          this.message = 'Failed to create order';
          this.ordering = false;
        },
      });
    }
  }
}
