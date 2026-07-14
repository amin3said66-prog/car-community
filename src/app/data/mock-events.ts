/**
 * Mock Events Data
 * Sample community events for development and testing
 */
import { Event } from '../models/event.model';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-001',
    title: 'Monthly Car Meetup - Downtown',
    description:
      'Join us for our monthly car enthusiast meetup! Show off your rides, meet fellow car lovers, and enjoy some refreshments. All car types and enthusiasts welcome!',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=400&fit=crop',
    location: 'Downtown Central Park',
    date: new Date('2024-03-15'),
    time: '10:00 AM',
    organizer: 'John Tesla',
    organizerId: 'user-001',
    organizerImage: 'https://i.pravatar.cc/150?img=1',
    attendees: ['user-002', 'user-003', 'user-004', 'user-005'],
    maxAttendees: 50,
    category: 'meetup',
    price: 0,
    status: 'upcoming',
  },
  {
    id: 'event-002',
    title: 'Track Day - Speed Experience',
    description:
      'Experience the thrill of high-speed driving on a professional race track. Bring your car or use one of ours. Professional instructors will guide you through safe driving techniques.',
    image: 'https://images.unsplash.com/photo-1488824295083-792033602e82?w=500&h=400&fit=crop',
    location: 'Racing Circuit - North Valley',
    date: new Date('2024-03-22'),
    time: '09:00 AM',
    organizer: 'Michael Porsche',
    organizerId: 'user-003',
    organizerImage: 'https://i.pravatar.cc/150?img=3',
    attendees: ['user-001', 'user-005'],
    maxAttendees: 30,
    category: 'race',
    price: 150,
    status: 'upcoming',
  },
  {
    id: 'event-003',
    title: 'Automotive Photography Workshop',
    description:
      'Learn professional photography techniques specifically for capturing cars. Covers lighting, angles, composition, and post-processing. Perfect for social media content creation.',
    image: 'https://images.unsplash.com/photo-1606611013016-969c19d24e5f?w=500&h=400&fit=crop',
    location: 'Photography Studio - Arts District',
    date: new Date('2024-03-28'),
    time: '02:00 PM',
    organizer: 'Sarah BMW',
    organizerId: 'user-002',
    organizerImage: 'https://i.pravatar.cc/150?img=2',
    attendees: ['user-001', 'user-003', 'user-004'],
    maxAttendees: 20,
    category: 'workshop',
    price: 75,
    status: 'upcoming',
  },
  {
    id: 'event-004',
    title: 'Luxury Cars Showroom Tour',
    description:
      'Exclusive tour of premium luxury car dealerships. See the latest models, take photos, and get expert insights on high-end vehicles. Perfect for serious collectors and enthusiasts.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b83ad38?w=500&h=400&fit=crop',
    location: 'Luxury District - Premium Row',
    date: new Date('2024-04-05'),
    time: '03:00 PM',
    organizer: 'Emma Mercedes',
    organizerId: 'user-005',
    organizerImage: 'https://i.pravatar.cc/150?img=5',
    attendees: ['user-002', 'user-003'],
    maxAttendees: 25,
    category: 'showroom',
    price: 25,
    status: 'upcoming',
  },
];
