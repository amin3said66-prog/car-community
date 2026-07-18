import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  router = inject(Router);

  menuOpen = false;

  navLinks = [
    { path: '/cars',      label: 'Cars',      icon: '🚗' },
    { path: '/posts',     label: 'Posts',     icon: '📝' },
    { path: '/events',    label: 'Events',    icon: '🎉' },
    { path: '/customers', label: 'Community', icon: '👥' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  ];

  get showShell(): boolean {
    const url = this.router.url;
    return !url.startsWith('/auth') && url !== '/';
  }
}
