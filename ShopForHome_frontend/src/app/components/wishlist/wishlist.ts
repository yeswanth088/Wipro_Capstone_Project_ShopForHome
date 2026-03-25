import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css'],
  standalone: false
})
export class Wishlist implements OnInit {
  
  wishlistItems: any[] = [];

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  removeItem(index: number) {
    this.wishlistItems.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
  }

  moveToCart(product: any, index: number) {
    // Add to Cart
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove from Wishlist
    this.removeItem(index);
    
    alert('Product moved to cart!');
  }
}
