import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  standalone: false
})
export class Products implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  wishlistIds: number[] = [];
  
  selectedCategory: string = 'All';
  selectedPriceRange: string = 'All Prices';

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        this.applyFilters();
        console.log("Products loaded successfully", this.products);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Critical error fetching products", err);
      }
    });

    this.loadWishlistIds();
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Error fetching categories", err);
      }
    });
  }

  loadWishlistIds() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    this.wishlistIds = wishlist.map((item: any) => item.productId || item.id);
  }

  isInWishlist(product: any): boolean {
    const id = product.productId || product.id;
    return this.wishlistIds.includes(id);
  }

  toggleWishlist(product: any) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const id = product.productId || product.id;
    
    if (this.isInWishlist(product)) {
      // Remove from wishlist
      wishlist = wishlist.filter((item: any) => (item.productId || item.id) !== id);
    } else {
      // Add to wishlist
      wishlist.push(product);
    }
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    this.loadWishlistIds();
  }

  addToCart(product: any) {
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

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  selectPriceRange(range: string) {
    this.selectedPriceRange = range;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const categoryMatch = this.selectedCategory === 'All' || p.category?.categoryName === this.selectedCategory;
      
      let priceMatch = true;
      if (this.selectedPriceRange === 'Under ₹50') {
        priceMatch = p.price < 50;
      } else if (this.selectedPriceRange === '₹50 – ₹100') {
        priceMatch = p.price >= 50 && p.price <= 100;
      } else if (this.selectedPriceRange === '₹100+') {
        priceMatch = p.price > 100;
      }

      return categoryMatch && priceMatch;
    });
  }
}