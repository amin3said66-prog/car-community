import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);

  user: User | null = null;
  loading = false;
  notFound = false;
  isFollowing = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const userId = params['id'] as string | undefined;
      if (!userId) {
        this.notFound = true;
        return;
      }

      this.loading = true;
      this.customerService.getById(userId).subscribe({
        next: (user: User | undefined) => {
          this.user = user ?? null;
          this.notFound = !user;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        },
      });
    });
  }

  toggleFollow(): void {
    if (!this.user) return;

    const action = this.isFollowing
      ? this.customerService.unfollow(this.user.id)
      : this.customerService.follow(this.user.id);

    action.subscribe(updated => {
      if (updated) {
        this.user = updated;
        this.isFollowing = !this.isFollowing;
      }
    });
  }

  stars(rating: number): string {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }
}
