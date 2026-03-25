import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Api {

  baseUrl = "http://localhost:5047";

  constructor(private http: HttpClient, private router: Router) {}

  private get userId(): string {
    return localStorage.getItem('userId') || '0';
  }

  // --- Products ---
  getProducts() {
    return this.http.get(this.baseUrl + "/api/Products/Show");
  }

  addProduct(product: any) {
    return this.http.post(this.baseUrl + `/api/Products/Create?userId=${this.userId}`, product);
  }

  updateProduct(id: number, product: any) {
    return this.http.put(this.baseUrl + `/api/Products/Update/${id}?userId=${this.userId}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + `/api/Products/Delete/${id}?userId=${this.userId}`);
  }

  uploadCSV(formData: FormData) {
    return this.http.post(this.baseUrl + `/api/BulkUpload/UploadCSV?userId=${this.userId}`, formData);
  }

  // --- Orders ---
  placeOrder(orderDetails: any) {
    return this.http.post(this.baseUrl + '/api/Orders/PlaceOrder', orderDetails);
  }

  getOrders(userId: number) {
    return this.http.get(this.baseUrl + `/api/Orders/user/${userId}`);
  }

  // --- Sales Report ---
  getSalesReport(startDate: string, endDate: string) {
    return this.http.get(this.baseUrl + `/api/SalesReport?start=${startDate}&end=${endDate}&userId=${this.userId}`);
  }

  // --- Categories ---
  getCategories() {
    return this.http.get(this.baseUrl + "/api/Category/Show");
  }

  addCategory(category: any) {
    return this.http.post(this.baseUrl + `/api/Category/Create?userId=${this.userId}`, category);
  }

  // --- Users ---
  getUsers() {
    return this.http.get(this.baseUrl + "/api/Users/SHOW");
  }

  createUser(user: any) {
    return this.http.post(this.baseUrl + "/api/Users/CREATE", user);
  }

  updateUser(id: number, user: any) {
    return this.http.put(this.baseUrl + `/api/Users/UPDATE?id=${id}&userId=${this.userId}`, user);
  }

  deleteUser(userId: string | number) {
    return this.http.delete(this.baseUrl + `/api/Users/DELETE?id=${userId}&userId=${this.userId}`);
  }

  // --- Authentication ---
  // Returns { Message, UserId, Role }
  login(credentials: any) {
    return this.http.post(
      this.baseUrl + `/api/Logs/login?email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`,
      {}
    );
  }

  register(user: any) {
    return this.http.post(this.baseUrl + "/api/Users/CREATE", user);
  }

  // --- Session Management ---
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}