import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService, OrderResponse } from '../services/order';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);

  orders: OrderResponse[] = [];
  message = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data) => (this.orders = data),
      error: () => (this.message = 'Failed to load orders'),
    });
  }
}
