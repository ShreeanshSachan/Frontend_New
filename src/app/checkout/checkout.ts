import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment';
import { OrderService, OrderResponse } from '../services/order';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private paymentService = inject(PaymentService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  orderIds: number[] = [];
  totalAmount = 0;
  orders: OrderResponse[] = [];

  cardNumber = '';
  cardName = '';
  expiry = '';
  cvv = '';
  paymentMethod = 'credit_card';

  processing = false;
  message = '';

  ngOnInit(): void {
    const state = history.state as { orderIds: number[]; totalAmount: number };
    if (state?.orderIds?.length) {
      this.orderIds = state.orderIds;
      this.totalAmount = state.totalAmount;
      this.loadOrders();
    } else {
      this.router.navigate(['/cart']);
    }
  }

  loadOrders(): void {
    for (const id of this.orderIds) {
      this.orderService.getOrderById(id).subscribe({
        next: (order) => this.orders.push(order),
      });
    }
  }

  pay(): void {
    if (!this.cardNumber || !this.cardName) {
      this.message = 'Please fill in all payment details';
      return;
    }

    this.processing = true;
    this.message = '';
    let completed = 0;
    let allSuccess = true;
    let transactionId = '';

    for (const orderId of this.orderIds) {
      const order = this.orders.find(o => o.orderId === orderId);
      const amount = order?.totalPrice || this.totalAmount / this.orderIds.length;

      this.paymentService.processPayment({
        orderId,
        amount,
        paymentMethod: this.paymentMethod,
      }).subscribe({
        next: (res) => {
          completed++;
          if (res.status !== 'SUCCESS') {
            allSuccess = false;
          } else {
            transactionId = res.transactionId;
          }
          if (completed === this.orderIds.length) {
            this.router.navigate(['/payment-status'], {
              state: {
                success: allSuccess,
                transactionId,
                totalAmount: this.totalAmount,
                orderIds: this.orderIds,
              },
            });
          }
        },
        error: () => {
          completed++;
          allSuccess = false;
          if (completed === this.orderIds.length) {
            this.router.navigate(['/payment-status'], {
              state: {
                success: false,
                transactionId: '',
                totalAmount: this.totalAmount,
                orderIds: this.orderIds,
              },
            });
          }
        },
      });
    }
  }
}
