import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Navbar } from './components/navbar/navbar';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { ProductDetails } from './components/product-details/product-details';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Cart } from './components/cart/cart';
import { Orders } from './components/orders/orders';
import { Wishlist } from './components/wishlist/wishlist';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { AdminProducts } from './components/admin-products/admin-products';
import { AdminUsers } from './components/admin-users/admin-users';
import { AdminUpload } from './components/admin-upload/admin-upload';
import { AdminSalesReport } from './components/admin-sales-report/admin-sales-report';

@NgModule({
  declarations: [
    App,
    Navbar,
    Home,
    Products,
    ProductDetails,
    Login,
    Register,
    Cart,
    Orders,
    Wishlist,
    AdminDashboard,
    AdminProducts,
    AdminUsers,
    AdminUpload,
    AdminSalesReport
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [App]
})
export class AppModule {}