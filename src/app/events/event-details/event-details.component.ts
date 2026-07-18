import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../models/event.model';
import { EventService } from '../event.service';

const CURRENT_USER_ID = 'current-user';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);

  event: Event | null = null;
  loading = false;
  notFound = false;
  isAttending = false;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const eventId = params['id'] as string | undefined;
      if (!eventId) {
        this.notFound = true;
        return;
      }

      this.loading = true;
      this.eventService.getById(eventId).subscribe({
        next: (event: Event | undefined) => {
          this.event = event ?? null;
          this.notFound = !event;
          this.isAttending = event?.attendees.includes(CURRENT_USER_ID) ?? false;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        },
      });
    });
  }

  catIcon(cat: string): string {
    const map: Record<string, string> = { meetup: '🤝', race: '🏁', workshop: '🔧', showroom: '🏪' };
    return map[cat] ?? '🎉';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      upcoming: 'upcoming',
      ongoing: 'ongoing',
      completed: 'completed',
      cancelled: 'cancelled',
    };
    return map[status] ?? '';
  }

  spotsLeft(): number {
    return this.event ? this.event.maxAttendees - this.event.attendees.length : 0;
  }

  toggleAttend(): void {
    if (!this.event) return;

    const action = this.isAttending
      ? this.eventService.unregisterAttendee(this.event.id, CURRENT_USER_ID)
      : this.eventService.registerAttendee(this.event.id, CURRENT_USER_ID);

    action.subscribe(updated => {
      if (updated) {
        this.event = updated;
        this.isAttending = updated.attendees.includes(CURRENT_USER_ID);
      }
    });
  }
}
