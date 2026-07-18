/**
 * Customer Service
 * Manages community members (users).
 */
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { MOCK_USERS } from '../data/mock-users';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly users$ = new BehaviorSubject<User[]>(MOCK_USERS);

  getAll(): Observable<User[]> {
    return of(this.users$.value);
  }

  getById(id: string): Observable<User | undefined> {
    return of(this.users$.value.find(u => u.id === id));
  }

  search(query: string): Observable<User[]> {
    const q = query.toLowerCase();
    return of(
      this.users$.value.filter(
        u =>
          u.fullName.toLowerCase().includes(q) ||
          u.userName.toLowerCase().includes(q) ||
          u.bio.toLowerCase().includes(q)
      )
    );
  }

  getVerified(): Observable<User[]> {
    return of(this.users$.value.filter(u => u.isVerified));
  }

  getTotalCarsOwned(): number {
    return this.users$.value.reduce((sum, u) => sum + u.carsOwned, 0);
  }

  getTotalPosts(): number {
    return this.users$.value.reduce((sum, u) => sum + u.postsCount, 0);
  }

  getVerifiedCount(): number {
    return this.users$.value.filter(u => u.isVerified).length;
  }

  follow(userId: string): Observable<User | undefined> {
    const users = this.users$.value;
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return of(undefined);

    const updated = [...users];
    updated[index] = { ...updated[index], followers: (updated[index].followers ?? 0) + 1 };
    this.users$.next(updated);
    return of(updated[index]);
  }

  unfollow(userId: string): Observable<User | undefined> {
    const users = this.users$.value;
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return of(undefined);

    const updated = [...users];
    updated[index] = {
      ...updated[index],
      followers: Math.max(0, (updated[index].followers ?? 0) - 1),
    };
    this.users$.next(updated);
    return of(updated[index]);
  }
}
