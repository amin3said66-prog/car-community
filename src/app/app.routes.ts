import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/cars', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'cars', loadChildren: () => import('./cars/cars-module').then(m => m.CarsModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers-module').then(m => m.CustomersModule) },
  { path: 'posts', loadChildren: () => import('./posts/posts-module').then(m => m.PostsModule) },
  { path: 'events', loadChildren: () => import('./events/events-module').then(m => m.EventsModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule) },
];
