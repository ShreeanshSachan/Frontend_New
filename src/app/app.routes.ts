import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { PaymentStatus } from './payment-status/payment-status';
import { Orders } from './orders/orders';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'payment-status', component: PaymentStatus },
  { path: 'orders', component: Orders },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '/home' },
];
