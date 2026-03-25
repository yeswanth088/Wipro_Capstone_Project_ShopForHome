import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false
})
export class Home implements OnInit {

  products: any[] = [];

  constructor(private api: Api, private cd: ChangeDetectorRef) {}

  ngOnInit(){
    this.loadProducts();
  }

  loadProducts(){
    this.api.getProducts().subscribe({
      next: (data:any) => {
        this.products = data;
        console.log("Products loaded successfully:", this.products);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Critical error fetching products from API:", err);
      }
    });
  }

  addToCart(product:any){
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Show toast notification
    const toastElement = document.getElementById('cartToast');
    if (toastElement) {
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.show();
    }
  }

}