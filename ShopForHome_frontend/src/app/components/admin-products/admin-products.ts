import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  isLoading = false;
  
  // For Modal
  showModal = false;
  editingProduct: any = null;
  
  newProduct = {
    productName: '',
    price: 0,
    quantity: 0,
    imageUrl: '',
    categoryId: 0,
    stock: 0, // InStock
    rating: 4.5
  };

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading = true;
    console.log('Loading products...');
    this.api.getProducts().subscribe({
      next: (data: any) => {
        console.log('Products received:', data);
        this.products = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  openAddModal() {
    this.editingProduct = null;
    this.newProduct = { 
      productName: '', 
      price: 0, 
      quantity: 0, 
      imageUrl: '', 
      categoryId: this.categories[0]?.categoryId || 0,
      stock: 0,
      rating: 4.5
    };
    this.showModal = true;
  }

  openEditModal(p: any) {
    this.editingProduct = p;
    this.newProduct = { ...p };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    this.isLoading = true;
    if (this.editingProduct) {
      // Update existing
      this.api.updateProduct(this.editingProduct.productId || this.editingProduct.id, this.newProduct).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error updating product', err);
          this.isLoading = false;
        }
      });
    } else {
      // Add new
      this.api.addProduct(this.newProduct).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error adding product', err);
          this.isLoading = false;
        }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.api.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Error deleting product', err);
        }
      });
    }
  }
}
