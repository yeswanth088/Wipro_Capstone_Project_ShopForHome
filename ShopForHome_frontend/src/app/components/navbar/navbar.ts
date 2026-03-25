import { Component } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  
  constructor(public api: Api) {}

  onLogout() {
    alert('Logged out successfully!');
    this.api.logout();
  }
}
