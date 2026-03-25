import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  isLoading = false;

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    console.log('Loading users...');
    this.api.getUsers().subscribe({
      next: (data: any) => {
        console.log('Users received:', data);
        this.users = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });
  }

  toggleRole(user: any) {
    const isAdmin = user.role === 'Admin' || user.role === 1;
    const newRole = isAdmin ? 'Customer' : 'Admin';
    const updatedUser = { ...user, role: newRole };
    
    if (confirm(`Change ${user.name || user.username || user.email}'s role to ${newRole}?`)) {
      this.api.updateUser(user.userId || user.id, updatedUser).subscribe({
        next: () => {
          alert('User role updated!');
          this.loadUsers();
        },
        error: (err: any) => {
          console.error('Error updating role', err);
        }
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user', err);
        }
      });
    }
  }
}
