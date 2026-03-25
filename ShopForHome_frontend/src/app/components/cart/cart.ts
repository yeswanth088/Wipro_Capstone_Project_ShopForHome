import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector:'app-cart',
  templateUrl:'./cart.html',
  styleUrls:['./cart.css'],
  standalone:false
})
export class Cart implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;
  isCheckingOut = false;
  successMessage = '';
  errorMessage = '';

  constructor(private api: Api, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(){
    this.cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    this.calculateTotal();
  }

  removeItem(index: number){
    this.cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  checkout() {
    if (!this.api.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) return;

    this.isCheckingOut = true;
    this.successMessage = '';
    this.errorMessage = '';

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};

    const orderPayload = {
      userId: user.userId || user.id,
      totalAmount: this.totalPrice,
      items: this.cartItems.map(item => ({
        productId: item.productId || item.id,
        quantity: 1, // basic implementation assuming 1 per click for now
        price: item.price
      }))
    };

    this.api.placeOrder(orderPayload).subscribe({
      next: (res) => {
        this.isCheckingOut = false;
        const msg = 'Congratulations! Your order has been placed successfully.';
        this.successMessage = msg;
        alert(msg);
        this.cartItems = [];
        localStorage.removeItem('cart');
        this.calculateTotal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isCheckingOut = false;
        this.errorMessage = err.error?.message || 'Failed to place order. Please try again.';
        console.error('Checkout error', err);
      }
    });
  }
}