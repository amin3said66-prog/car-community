/**
 * Event Service
 * Manages community events and registrations
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Event } from '../models/event.model';
import { MOCK_EVENTS } from '../data/mock-events';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = environment.apiUrl + '/events';
  private events$ = new BehaviorSubject<Event[]>(MOCK_EVENTS);

  constructor(private http: HttpClient) {}

  /**
   * Get all events
   */
  getAll(): Observable<Event[]> {
    return of(this.events$.value);
  }

  /**
   * Get event by ID
   */
  getById(id: string): Observable<Event> {
    const event = this.events$.value.find(e => e.id === id);
    return of(event!);
  }

  /**
   * Get events by category
   */
  getByCategory(category: string): Observable<Event[]> {
    const filtered = this.events$.value.filter(e => e.category === category);
    return of(filtered);
  }

  /**
   * Get events by organizer
   */
  getByOrganizer(organizerId: string): Observable<Event[]> {
    const filtered = this.events$.value.filter(e => e.organizerId === organizerId);
    return of(filtered);
  }

  /**
   * Get upcoming events
   */
  getUpcoming(): Observable<Event[]> {
    const now = new Date();
    const upcoming = this.events$.value
      .filter(e => new Date(e.date) > now && e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return of(upcoming);
  }

  /**
   * Get past events
   */
  getPast(): Observable<Event[]> {
    const now = new Date();
    const past = this.events$.value
      .filter(e => new Date(e.date) < now && e.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return of(past);
  }

  /**
   * Search events by title or location
   */
  search(query: string): Observable<Event[]> {
    const results = this.events$.value.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
    return of(results);
  }

  /**
   * Get events by price range
   */
  filterByPrice(minPrice: number, maxPrice: number): Observable<Event[]> {
    const filtered = this.events$.value.filter(e =>
      e.price >= minPrice && e.price <= maxPrice
    );
    return of(filtered);
  }

  /**
   * Create new event
   */
  create(data: Partial<Event>): Observable<Event> {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      image: data.image || '',
      location: data.location || '',
      date: data.date || new Date(),
      time: data.time || '',
      organizer: data.organizer || '',
      organizerId: data.organizerId || '',
      organizerImage: data.organizerImage || '',
      attendees: [],
      maxAttendees: data.maxAttendees || 50,
      category: data.category || 'meetup',
      price: data.price || 0,
      status: 'upcoming',
    };

    const currentEvents = this.events$.value;
    this.events$.next([...currentEvents, newEvent]);
    return of(newEvent);
  }

  /**
   * Update event
   */
  update(id: string, data: Partial<Event>): Observable<Event> {
    const currentEvents = this.events$.value;
    const index = currentEvents.findIndex(e => e.id === id);

    if (index > -1) {
      const updatedEvent: Event = {
        ...currentEvents[index],
        ...data,
      };
      currentEvents[index] = updatedEvent;
      this.events$.next([...currentEvents]);
      return of(updatedEvent);
    }

    return of(data as Event);
  }

  /**
   * Delete event
   */
  delete(id: string): Observable<void> {
    const currentEvents = this.events$.value;
    this.events$.next(currentEvents.filter(e => e.id !== id));
    return of(void 0);
  }

  /**
   * Register user for event
   */
  registerAttendee(eventId: string, userId: string): Observable<Event> {
    const currentEvents = this.events$.value;
    const event = currentEvents.find(e => e.id === eventId);

    if (event && event.attendees.length < event.maxAttendees) {
      if (!event.attendees.includes(userId)) {
        event.attendees.push(userId);
        this.events$.next([...currentEvents]);
      }
      return of(event);
    }

    return of({} as Event);
  }

  /**
   * Unregister user from event
   */
  unregisterAttendee(eventId: string, userId: string): Observable<Event> {
    const currentEvents = this.events$.value;
    const event = currentEvents.find(e => e.id === eventId);

    if (event) {
      event.attendees = event.attendees.filter(id => id !== userId);
      this.events$.next([...currentEvents]);
      return of(event);
    }

    return of({} as Event);
  }

  /**
   * Get attendee count for event
   */
  getAttendeeCount(eventId: string): Observable<number> {
    const event = this.events$.value.find(e => e.id === eventId);
    return of(event?.attendees.length || 0);
  }

  /**
   * Check if user is registered for event
   */
  isUserRegistered(eventId: string, userId: string): Observable<boolean> {
    const event = this.events$.value.find(e => e.id === eventId);
    const isRegistered = event?.attendees.includes(userId) || false;
    return of(isRegistered);
  }

  /**
   * Get events attended by user
   */
  getEventsByAttendee(userId: string): Observable<Event[]> {
    const userEvents = this.events$.value.filter(e =>
      e.attendees.includes(userId)
    );
    return of(userEvents);
  }
}
