/**
 * Mock Posts Data
 * Sample community posts for development and testing
 */
import { Post } from '../models/post.model';

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-001',
    title: 'Best Electric Vehicles for 2024',
    content:
      'After extensive research and test drives, here are my top recommendations for electric vehicles in 2024. From luxury options to budget-friendly models, there\'s something for everyone. The technology has come a long way and EVs are now a practical choice for most drivers.',
    author: 'John Tesla',
    authorId: 'user-001',
    authorImage: 'https://i.pravatar.cc/150?img=1',
    image: 'https://images.unsplash.com/photo-1560958089-b8a46dd52a86?w=500&h=400&fit=crop',
    likes: 234,
    comments: [
      {
        id: 'comment-001',
        content: 'Great insights! I\'m considering switching to electric.',
        author: 'Alex',
        authorId: 'user-006',
        authorImage: 'https://i.pravatar.cc/150?img=6',
        createdAt: new Date('2024-02-10'),
        likes: 12,
      },
    ],
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-10'),
    category: 'advice',
    views: 1250,
    shares: 89,
  },
  {
    id: 'post-002',
    title: 'My Porsche 911 Carrera Experience',
    content:
      'Finally took delivery of my dream car - a stunning 911 Carrera in Guards Red. The driving experience is absolutely incredible. Every detail is perfection, from the responsive steering to the roaring engine. This is what German engineering is all about!',
    author: 'Michael Porsche',
    authorId: 'user-003',
    authorImage: 'https://i.pravatar.cc/150?img=3',
    image: 'https://images.unsplash.com/photo-1619405399517-541ec6ffc14f?w=500&h=400&fit=crop',
    likes: 567,
    comments: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    category: 'showcase',
    views: 2100,
    shares: 234,
  },
  {
    id: 'post-003',
    title: 'Discussion: Manual vs Automatic Transmission',
    content:
      'Let\'s discuss the merits of manual vs automatic transmissions. I\'ve driven both extensively and each has its advantages. What do you prefer? Are you a traditionalist who loves the engagement of a manual, or do you prefer the convenience of an automatic?',
    author: 'Sarah BMW',
    authorId: 'user-002',
    authorImage: 'https://i.pravatar.cc/150?img=2',
    likes: 145,
    comments: [
      {
        id: 'comment-002',
        content: 'Manual all the way! More control and fun.',
        author: 'Chris',
        authorId: 'user-007',
        authorImage: 'https://i.pravatar.cc/150?img=7',
        createdAt: new Date('2024-02-07'),
        likes: 45,
      },
      {
        id: 'comment-003',
        content: 'Automatic for city driving, manual for weekend drives.',
        author: 'Lisa',
        authorId: 'user-008',
        authorImage: 'https://i.pravatar.cc/150?img=8',
        createdAt: new Date('2024-02-07'),
        likes: 38,
      },
    ],
    createdAt: new Date('2024-02-06'),
    updatedAt: new Date('2024-02-07'),
    category: 'discussion',
    views: 892,
    shares: 67,
  },
];
