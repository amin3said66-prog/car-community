/**
 * Event Service
 * Manages community events and registrations.
 */
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Event } from '../models/event.model';
import { MOCK_EVENTS } from '../data/mock-events';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly events$ = new BehaviorSubject<Event[]>(MOCK_EVENTS);

  getAll(): Observable<Event[]> {
    return of(this.events$.value);
  }

  getById(id: string): Observable<Event | undefined> {
    return of(this.events$.value.find(e => e.id === id));
  }

  getByCategory(category: string): Observable<Event[]> {
    return of(this.events$.value.filter(e => e.category === category));
  }

  getByOrganizer(organizerId: string): Observable<Event[]> {
    return of(this.events$.value.filter(e => e.organizerId === organizerId));
  }

  getUpcoming(): Observable<Event[]> {
    const now = new Date();
    return of(
      this.events$.value
        .filter(e => new Date(e.date) > now && e.status === 'upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
  }

  getPast(): Observable<Event[]> {
    const now = new Date();
    return of(
      this.events$.value
        .filter(e => new Date(e.date) < now && e.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  search(query: string): Observable<Event[]> {
    const q = query.toLowerCase();
    return of(
      this.events$.value.filter(
        e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      )
    );
  }

  filterByPrice(minPrice: number, maxPrice: number): Observable<Event[]> {
    return of(this.events$.value.filter(e => e.price >= minPrice && e.price <= maxPrice));
  }

  create(data: Partial<Event>): Observable<Event> {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: data.title ?? '',
      description: data.description ?? '',
      image: data.image ?? '',
      location: data.location ?? '',
      date: data.date ?? new Date(),
      time: data.time ?? '',
      organizer: data.organizer ?? '',
      organizerId: data.organizerId ?? '',
      organizerImage: data.organizerImage ?? '',
      attendees: [],
      maxAttendees: data.maxAttendees ?? 50,
      category: data.category ?? 'meetup',
      price: data.price ?? 0,
      status: 'upcoming',
    };
    this.events$.next([...this.events$.value, newEvent]);
    return of(newEvent);
  }

  update(id: string, data: Partial<Event>): Observable<Event | undefined> {
    const events = this.events$.value;
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return of(undefined);

    const updatedEvent: Event = { ...events[index], ...data };
    const updated = [...events];
    updated[index] = updatedEvent;
    this.events$.next(updated);
    return of(updatedEvent);
  }

  delete(id: string): Observable<void> {
    this.events$.next(this.events$.value.filter(e => e.id !== id));
    return of(undefined);
  }

  registerAttendee(eventId: string, userId: string): Observable<Event | undefined> {
    const events = this.events$.value;
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return of(undefined);

    const event = events[index];
    if (event.attendees.includes(userId) || event.attendees.length >= event.maxAttendees) {
      return of(event);
    }

    const updated = [...events];
    updated[index] = { ...event, attendees: [...event.attendees, userId] };
    this.events$.next(updated);
    return of(updated[index]);
  }

  unregisterAttendee(eventId: string, userId: string): Observable<Event | undefined> {
    const events = this.events$.value;
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) return of(undefined);

    const event = events[index];
    const updated = [...events];
    updated[index] = { ...event, attendees: event.attendees.filter(id => id !== userId) };
    this.events$.next(updated);
    return of(updated[index]);
  }

  getAttendeeCount(eventId: string): Observable<number> {
    return of(this.events$.value.find(e => e.id === eventId)?.attendees.length ?? 0);
  }

  isUserRegistered(eventId: string, userId: string): Observable<boolean> {
    return of(this.events$.value.find(e => e.id === eventId)?.attendees.includes(userId) ?? false);
  }

  getEventsByAttendee(userId: string): Observable<Event[]> {
    return of(this.events$.value.filter(e => e.attendees.includes(userId)));
  }
}
