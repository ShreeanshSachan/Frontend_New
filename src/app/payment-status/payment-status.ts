import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-status',
  imports: [RouterLink],
  templateUrl: './payment-status.html',
  styleUrl: './payment-status.css',
})
export class PaymentStatus implements OnInit {
  success = false;
  transactionId = '';
  totalAmount = 0;
  orderIds: number[] = [];

  ngOnInit(): void {
    const state = history.state as {
      success: boolean;
      transactionId: string;
      totalAmount: number;
      orderIds: number[];
    };
    if (state) {
      this.success = state.success;
      this.transactionId = state.transactionId;
      this.totalAmount = state.totalAmount;
      this.orderIds = state.orderIds;
    }
  }
}
