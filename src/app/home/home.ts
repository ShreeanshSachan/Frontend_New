import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../services/product';
import { CartService } from '../services/cart';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  products: Product[] = [];
  message = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => (this.products = data),
      error: () => (this.message = 'Failed to load products'),
    });
  }

  addToCart(productId: number): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addItem(productId, 1).subscribe({
      next: () => {
        this.message = 'Added to cart!';
        setTimeout(() => (this.message = ''), 2000);
      },
      error: () => (this.message = 'Failed to add to cart'),
    });
  }
}
