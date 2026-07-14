import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { MOCK_USERS } from '../../data/mock-users';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  user: User | null = null;
  loading = false;
  isFollowing = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: any) => {
      const userId = params['id'];
      if (userId) {
        const found = MOCK_USERS.find(u => u.id === userId);
        if (found) {
          this.user = found;
        }
        this.loading = false;
      }
    });
  }

  toggleFollow(): void {
    if (this.user) {
      if (this.isFollowing) {
        if (this.user.followers) this.user.followers--;
      } else {
        if (!this.user.followers) this.user.followers = 0;
        this.user.followers++;
      }
      this.isFollowing = !this.isFollowing;
    }
  }

  stars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}
