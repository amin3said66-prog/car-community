import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Event } from '../../models/event.model';
import { MOCK_EVENTS } from '../../data/mock-events';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  loading = false;
  isAttending = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: any) => {
      const eventId = params['id'];
      if (eventId) {
        const found = MOCK_EVENTS.find(e => e.id === eventId);
        if (found) {
          this.event = found;
          this.isAttending = found.attendees.includes('current-user');
        }
        this.loading = false;
      }
    });
  }

  catIcon(cat: string): string {
    const map: Record<string, string> = { meetup: '🤝', race: '🏁', workshop: '🔧', showroom: '🏪' };
    return map[cat] ?? '🎉';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = { upcoming: 'upcoming', ongoing: 'ongoing', completed: 'completed', cancelled: 'cancelled' };
    return map[status] ?? '';
  }

  spotsLeft(): number {
    return this.event ? this.event.maxAttendees - this.event.attendees.length : 0;
  }

  toggleAttend(): void {
    if (this.event) {
      if (this.isAttending) {
        const idx = this.event.attendees.indexOf('current-user');
        if (idx > -1) {
          this.event.attendees.splice(idx, 1);
        }
      } else {
        if (this.event.attendees.length < this.event.maxAttendees) {
          this.event.attendees.push('current-user');
        }
      }
      this.isAttending = !this.isAttending;
    }
  }
}
