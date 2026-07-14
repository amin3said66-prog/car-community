/**
 * Post Model
 * Represents a community post
 */
import { Comment } from './comment.model';

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorImage: string;
  image?: string;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  category: 'discussion' | 'advice' | 'news' | 'showcase';
  views?: number;
  shares?: number;
}
