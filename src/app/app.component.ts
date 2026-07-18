import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  router = inject(Router);
  menuOpen = false;

  navLinks = [
    { path: '/cars',      label: 'Cars',      icon: 'directions_car' },
    { path: '/posts',     label: 'Posts',     icon: 'article' },
    { path: '/events',    label: 'Events',    icon: 'celebration' },
    { path: '/customers', label: 'Community', icon: 'groups' },
    { path: '/dashboard', label: 'Dashboard', icon: 'bar_chart' },
  ];

  get showShell(): boolean {
    const url = this.router.url;
    return !url.startsWith('/auth') && url !== '/';
  }
}
