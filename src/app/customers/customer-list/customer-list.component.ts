import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  users: User[] = [];
  filtered: User[] = [];
  search = '';
  verifiedOnly = false;
  error: string | null = null;

  totalCarsOwned = 0;
  totalPosts = 0;
  verifiedCount = 0;

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.filtered = users;
        this.totalCarsOwned = this.customerService.getTotalCarsOwned();
        this.totalPosts = this.customerService.getTotalPosts();
        this.verifiedCount = this.customerService.getVerifiedCount();
      },
      error: () => {
        this.error = 'Failed to load members. Please try again.';
      },
    });
  }

  applyFilters(): void {
    let result = this.users;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(
        u =>
          u.fullName.toLowerCase().includes(q) ||
          u.userName.toLowerCase().includes(q) ||
          u.bio.toLowerCase().includes(q)
      );
    }
    if (this.verifiedOnly) {
      result = result.filter(u => u.isVerified);
    }
    this.filtered = result;
  }

  toggleVerified(): void {
    this.verifiedOnly = !this.verifiedOnly;
    this.applyFilters();
  }

  stars(rating: number): string {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }
}
