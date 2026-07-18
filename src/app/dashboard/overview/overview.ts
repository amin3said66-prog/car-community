import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { MOCK_CARS } from '../../data/mock-cars';
import { MOCK_USERS } from '../../data/mock-users';
import { MOCK_POSTS } from '../../data/mock-posts';
import { MOCK_EVENTS } from '../../data/mock-events';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ImgFallbackDirective],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class OverviewComponent implements OnInit {
  stats = {
    totalCars:      0,
    featuredCars:   0,
    totalUsers:     0,
    verifiedUsers:  0,
    totalPosts:     0,
    totalLikes:     0,
    totalEvents:    0,
    upcomingEvents: 0,
  };

  recentCars     = MOCK_CARS.slice(0, 3);
  recentPosts    = MOCK_POSTS.slice(0, 3);
  upcomingEvents = MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0, 3);
  topMembers     = MOCK_USERS.slice(0, 4);

  ngOnInit(): void {
    this.stats = {
      totalCars:      MOCK_CARS.length,
      featuredCars:   MOCK_CARS.filter(c => c.featured).length,
      totalUsers:     MOCK_USERS.length,
      verifiedUsers:  MOCK_USERS.filter(u => u.isVerified).length,
      totalPosts:     MOCK_POSTS.length,
      totalLikes:     MOCK_POSTS.reduce((s, p) => s + p.likes, 0),
      totalEvents:    MOCK_EVENTS.length,
      upcomingEvents: MOCK_EVENTS.filter(e => e.status === 'upcoming').length,
    };
  }
}
