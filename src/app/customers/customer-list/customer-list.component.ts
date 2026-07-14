import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_USERS } from '../../data/mock-users';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  search = '';
  verifiedOnly = false;

  totalCarsOwned = 0;
  totalPosts = 0;
  verifiedCount = 0;

  ngOnInit(): void {
    this.users = MOCK_USERS;
    this.filtered = MOCK_USERS;
    this.totalCarsOwned = MOCK_USERS.reduce((s, u) => s + u.carsOwned, 0);
    this.totalPosts = MOCK_USERS.reduce((s, u) => s + u.postsCount, 0);
    this.verifiedCount = MOCK_USERS.filter(u => u.isVerified).length;
  }

  applyFilters(): void {
    let result = this.users;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(u =>
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
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}
