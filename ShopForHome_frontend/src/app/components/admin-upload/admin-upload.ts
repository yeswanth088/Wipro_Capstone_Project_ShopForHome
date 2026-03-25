import { Component } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-admin-upload',
  standalone: false,
  templateUrl: './admin-upload.html',
  styleUrl: './admin-upload.css',
})
export class AdminUpload {
  selectedFile: File | null = null;
  adminId: string = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private api: Api) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.adminId = user.userId || user.id || '';
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.errorMessage = '';
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a CSV file first.';
      return;
    }

    if (!this.adminId) {
      this.errorMessage = 'Admin ID is missing.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('adminId', this.adminId);

    this.api.uploadCSV(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Products uploaded successfully!';
        this.selectedFile = null;
        // clear file input
        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to upload CSV. Please check the file format and try again.';
        console.error('Upload error', err);
      }
    });
  }
}
