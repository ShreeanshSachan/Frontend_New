import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  email = '';
  password = '';
  name = '';
  message = '';
  isError = false;

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
  }

  submit(): void {
    if (this.isLoginMode) {
      this.auth.login({ email: this.email, password: this.password }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.message = 'Invalid email or password';
          this.isError = true;
        },
      });
    } else {
      this.auth.register({
        name: this.name,
        email: this.email,
        password: this.password,
        role: 'USER',
      }).subscribe({
        next: () => {
          this.message = 'Registration successful! Please login.';
          this.isError = false;
          this.isLoginMode = true;
          this.name = '';
          this.email = '';
          this.password = '';
        },
        error: (err) => {
          this.message = err.error?.message || 'Registration failed';
          this.isError = true;
        },
      });
    }
  }
}
