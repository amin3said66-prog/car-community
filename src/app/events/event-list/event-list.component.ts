import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventService } from '../event.service';

const CURRENT_USER_ID = 'current-user';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  private readonly eventService = inject(EventService);

  events: Event[] = [];
  filtered: Event[] = [];
  search = '';
  activeCategory = '';
  error: string | null = null;

  readonly categories = ['', 'meetup', 'race', 'workshop', 'showroom'];

  ngOnInit(): void {
    this.eventService.getAll().subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.filtered = events;
      },
      error: () => {
        this.error = 'Failed to load events. Please try again.';
      },
    });
  }

  applyFilters(): void {
    let result = this.events;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(
        e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      );
    }
    if (this.activeCategory) {
      result = result.filter(e => e.category === this.activeCategory);
    }
    this.filtered = result;
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  catIcon(cat: string): string {
    const map: Record<string, string> = { meetup: '🤝', race: '🏎️', workshop: '🔧', showroom: '🏛️' };
    return map[cat] ?? '🎉';
  }

  statusClass(s: string): string {
    const map: Record<string, string> = { upcoming: 'green', ongoing: 'cyan', completed: 'grey', cancelled: 'red' };
    return map[s] ?? '';
  }

  spotsLeft(event: Event): number {
    return event.maxAttendees - event.attendees.length;
  }

  join(event: Event, e: MouseEvent): void {
    e.preventDefault();
    if (this.spotsLeft(event) > 0) {
      this.eventService.registerAttendee(event.id, CURRENT_USER_ID).subscribe(updated => {
        if (updated) {
          const index = this.events.findIndex(ev => ev.id === event.id);
          if (index !== -1) this.events[index] = updated;
          this.applyFilters();
        }
      });
    }
  }
}
