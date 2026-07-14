/**
 * Event Model
 * Represents a community event
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: Date;
  time: string;
  organizer: string;
  organizerId: string;
  organizerImage: string;
  attendees: string[];
  maxAttendees: number;
  category: 'meetup' | 'race' | 'workshop' | 'showroom';
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}
