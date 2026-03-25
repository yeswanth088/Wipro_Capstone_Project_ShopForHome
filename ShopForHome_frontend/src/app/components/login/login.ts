import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  showToast = false;
  isLoading = false;

  constructor(private api: Api, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showToast = false;

    const credentials = { email: this.email, password: this.password };

    this.api.login(credentials).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        // Backend (LogsController) returns { Message, UserId, Role }
        // Note: Role is an enum value (0 = User, 1 = Admin)
        const roleStr = (res.role === 1 || res.role === 'Admin') ? 'Admin' : 'Customer';
        localStorage.setItem('userId', String(res.userId));
        localStorage.setItem('role', roleStr);
        localStorage.setItem('user', JSON.stringify({ userId: res.userId, role: roleStr }));
        
        alert('Welcome! Login successful.');
        this.showToast = true;

        setTimeout(() => {
          if (roleStr === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.statusText || 'Invalid email or password. Please try again.';
        console.error('Login error', err);
      }
    });
  }
}
