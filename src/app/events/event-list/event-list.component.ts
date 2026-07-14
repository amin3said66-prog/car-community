import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_EVENTS } from '../../data/mock-events';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filtered: Event[] = [];
  search = '';
  activeCategory = '';
  activeStatus = '';

  categories = ['', 'meetup', 'race', 'workshop', 'showroom'];

  ngOnInit(): void {
    this.events = MOCK_EVENTS;
    this.filtered = MOCK_EVENTS;
  }

  applyFilters(): void {
    let result = this.events;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
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
      event.attendees.push('current-user');
    }
  }
}
