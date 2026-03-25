import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    name: '',
    email: '',
    password: ''
  };
  
  errorMessage = '';
  showToast = false;
  isLoading = false;

  constructor(private api: Api, private router: Router) {}

  onRegister() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    // Password validation: One capital, one character, one number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.user.password)) {
      this.errorMessage = 'Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character (e.g., Yeswanth@123).';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.showToast = false;

    const payload = {
      userId: 0,
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      role: 0
    };

    this.api.register(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        alert('Account created successfully!');
        this.showToast = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false; // Reset loading immediately
        console.error('Registration full error object:', err);
        
        let errorMsg = '';
        if (err.error && typeof err.error === 'object') {
          errorMsg = err.error.message || JSON.stringify(err.error);
        } else if (typeof err.error === 'string') {
          errorMsg = err.error;
        }

        const isDuplicate = err.status === 400 && 
          (errorMsg.toLowerCase().includes('registered') || errorMsg.toLowerCase().includes('already exists'));

        if (isDuplicate) {
          this.errorMessage = 'Email is registered already';
          // Using a small delay to ensure UI updates before alert blocks the thread
          setTimeout(() => alert('Email is registered already'), 100);
        } else {
          this.errorMessage = errorMsg || err.statusText || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
