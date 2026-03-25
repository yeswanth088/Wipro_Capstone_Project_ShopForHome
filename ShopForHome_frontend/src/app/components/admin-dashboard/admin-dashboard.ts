import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  adminName: string = '';

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    if (!this.api.isAdmin()) {
      this.router.navigate(['/']);
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.adminName = user.name || user.username || user.firstName || 'Admin';
    }
  }

  seedData() {
    const categories = ['Lighting', 'Textiles', 'Decor', 'Candles', 'Art'];
    
    // 1. Ensure categories exist
    this.api.getCategories().subscribe({
      next: (existingCats: any) => {
        const catMap = new Map();
        existingCats.forEach((c: any) => catMap.set(c.categoryName, c.categoryId));
        
        const catCreations = categories
          .filter(name => !catMap.has(name))
          .map(name => this.api.addCategory({ categoryName: name }));
          
        if (catCreations.length > 0) {
          forkJoin(catCreations).subscribe({
            next: (newCats: any) => {
              newCats.forEach((c: any) => catMap.set(c.categoryName, c.categoryId));
              this.createSampleProducts(catMap);
            },
            error: (err) => console.error('Error creating categories', err)
          });
        } else {
          this.createSampleProducts(catMap);
        }
      },
      error: (err) => {
        console.error('Error fetching categories', err);
        alert('Could not fetch categories. Is the backend running?');
      }
    });
  }

  private createSampleProducts(catMap: Map<string, number>) {
    const samples = [
      { productName: 'Modern Floor Lamp', price: 129, quantity: 15, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed657f9971?auto=format&fit=crop&q=80&w=400', categoryId: catMap.get('Lighting'), stock: 0, rating: 4.8 },
      { productName: 'Handwoven Throw', price: 45, quantity: 20, imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=400', categoryId: catMap.get('Textiles'), stock: 0, rating: 4.9 },
      { productName: 'Artisanal Candle', price: 25, quantity: 50, imageUrl: 'https://images.unsplash.com/photo-1603006375271-7f3b9044c06a?auto=format&fit=crop&q=80&w=400', categoryId: catMap.get('Candles'), stock: 0, rating: 4.7 },
      { productName: 'Abstract Wall Art', price: 199, quantity: 5, imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400', categoryId: catMap.get('Art'), stock: 0, rating: 5.0 }
    ];

    let count = 0;
    samples.forEach(s => {
      this.api.addProduct(s).subscribe({
        next: () => {
          count++;
          if (count === samples.length) {
            alert('Sample data added successfully! Go to Products to see them.');
          }
        },
        error: (err: any) => console.error('Seeding error', err)
      });
    });
  }
}
