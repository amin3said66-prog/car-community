/**
 * Comment Model
 * Represents a comment on a post or car listing
 */
export interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  authorImage: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
}
