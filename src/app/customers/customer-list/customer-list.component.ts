import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { User } from '../../models/user.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, ImgFallbackDirective],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  users: User[] = [];
  filtered: User[] = [];
  search = '';
  verifiedOnly = false;

  ngOnInit(): void {
    this.customerService.getAll().subscribe({
      next: (users) => { this.users = users; this.filtered = users; },
    });
  }

  applyFilters(): void {
    let result = this.users;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.userName.toLowerCase().includes(q)
      );
    }
    if (this.verifiedOnly) result = result.filter(u => u.isVerified);
    this.filtered = result;
  }

  toggleVerified(): void { this.verifiedOnly = !this.verifiedOnly; this.applyFilters(); }

  stars(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  get verifiedCount():  number { return this.users.filter(u => u.isVerified).length; }
  get totalCarsOwned(): number { return this.users.reduce((s, u) => s + u.carsOwned, 0); }
  get totalPosts():     number { return this.users.reduce((s, u) => s + u.postsCount, 0); }
}
