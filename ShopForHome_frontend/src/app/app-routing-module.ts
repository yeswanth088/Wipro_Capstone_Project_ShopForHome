import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [

{ path:'', component:Home },

{ path:'products', component:Products },

{ path:'product/:id', component:ProductDetails },

{ path:'login', component:Login },

{ path:'register', component:Register },

{ path:'cart', component:Cart },

{ path:'wishlist', component:Wishlist },

{ path:'orders', component:Orders },

{ path:'admin', component:AdminDashboard },

{ path:'admin/products', component:AdminProducts },

{ path:'admin/users', component:AdminUsers },

{ path:'admin/upload', component:AdminUpload },

{ path:'admin/sales-report', component:AdminSalesReport },

{ path:'**', redirectTo:'' }

];

@NgModule({
imports:[RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
exports:[RouterModule]
})

export class AppRoutingModule {}