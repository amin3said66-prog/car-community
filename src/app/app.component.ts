import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  menuOpen = false;

  navLinks = [
    { path: '/cars',      label: 'Cars',      icon: '🚗' },
    { path: '/posts',     label: 'Posts',     icon: '📝' },
    { path: '/events',    label: 'Events',    icon: '🎉' },
    { path: '/customers', label: 'Community', icon: '👥' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  constructor(public router: Router) {}

  get showShell(): boolean {
    const url = this.router.url;
    return !url.startsWith('/auth') && url !== '/';
  }
}
