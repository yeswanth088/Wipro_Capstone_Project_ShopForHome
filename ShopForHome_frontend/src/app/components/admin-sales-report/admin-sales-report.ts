import { Component } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-admin-sales-report',
  standalone: false,
  templateUrl: './admin-sales-report.html'
})
export class AdminSalesReport {
  startDate: string = '';
  endDate: string = '';
  reportData: any[] = [];
  totalRevenue: number = 0;
  isLoading = false;
  hasSearched = false;

  constructor(private api: Api) {}

  generateReport() {
    if (!this.startDate || !this.endDate) return;
    
    this.isLoading = true;
    this.hasSearched = true;
    
    this.api.getSalesReport(this.startDate, this.endDate).subscribe({
      next: (data: any) => {
        if (data && data.reportData) {
          this.reportData = data.reportData;
          this.totalRevenue = data.totalRevenue;
        } else {
          // Fallback if backend hasn't updated yet
          this.reportData = data;
          this.totalRevenue = this.reportData.reduce((sum, item) => sum + (item.totalAmount || item.price || 0), 0);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching report', err);
        this.reportData = [];
        this.totalRevenue = 0;
        this.isLoading = false;
      }
    });
  }
}
