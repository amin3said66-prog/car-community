/**
 * Post Service
 * Manages community posts and interactions.
 */
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { MOCK_POSTS } from '../data/mock-posts';

export type NewComment = Omit<Comment, 'id' | 'createdAt' | 'likes'>;

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly posts$ = new BehaviorSubject<Post[]>(MOCK_POSTS);

  getAll(): Observable<Post[]> {
    return of(this.posts$.value);
  }

  getById(id: string): Observable<Post | undefined> {
    return of(this.posts$.value.find(p => p.id === id));
  }

  getByCategory(category: string): Observable<Post[]> {
    return of(this.posts$.value.filter(p => p.category === category));
  }

  getByAuthor(authorId: string): Observable<Post[]> {
    return of(this.posts$.value.filter(p => p.authorId === authorId));
  }

  search(query: string): Observable<Post[]> {
    const q = query.toLowerCase();
    return of(
      this.posts$.value.filter(
        p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      )
    );
  }

  getTrending(): Observable<Post[]> {
    const sorted = [...this.posts$.value].sort((a, b) => {
      const scoreA = (a.likes ?? 0) + ((a.views ?? 0) * 0.1);
      const scoreB = (b.likes ?? 0) + ((b.views ?? 0) * 0.1);
      return scoreB - scoreA;
    });
    return of(sorted);
  }

  create(data: Partial<Post>): Observable<Post> {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: data.title ?? '',
      content: data.content ?? '',
      author: data.author ?? '',
      authorId: data.authorId ?? '',
      authorImage: data.authorImage ?? '',
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      category: data.category ?? 'discussion',
      views: 0,
      shares: 0,
    };
    this.posts$.next([...this.posts$.value, newPost]);
    return of(newPost);
  }

  update(id: string, data: Partial<Post>): Observable<Post | undefined> {
    const posts = this.posts$.value;
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedPost: Post = { ...posts[index], ...data, updatedAt: new Date() };
    const updated = [...posts];
    updated[index] = updatedPost;
    this.posts$.next(updated);
    return of(updatedPost);
  }

  delete(id: string): Observable<void> {
    this.posts$.next(this.posts$.value.filter(p => p.id !== id));
    return of(undefined);
  }

  likePost(id: string): Observable<Post | undefined> {
    const posts = this.posts$.value;
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return of(undefined);

    const updated = [...posts];
    updated[index] = { ...updated[index], likes: (updated[index].likes ?? 0) + 1 };
    this.posts$.next(updated);
    return of(updated[index]);
  }

  addComment(postId: string, comment: NewComment): Observable<Post | undefined> {
    const posts = this.posts$.value;
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) return of(undefined);

    const newComment: Comment = { ...comment, id: `comment-${Date.now()}`, createdAt: new Date(), likes: 0 };
    const updated = [...posts];
    updated[index] = { ...updated[index], comments: [...updated[index].comments, newComment] };
    this.posts$.next(updated);
    return of(updated[index]);
  }

  incrementView(id: string): Observable<Post | undefined> {
    const posts = this.posts$.value;
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return of(undefined);

    const updated = [...posts];
    updated[index] = { ...updated[index], views: (updated[index].views ?? 0) + 1 };
    this.posts$.next(updated);
    return of(updated[index]);
  }
}
