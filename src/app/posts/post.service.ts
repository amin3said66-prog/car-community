/**
 * Post Service
 * Manages community posts and interactions
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';
import { MOCK_POSTS } from '../data/mock-posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.apiUrl + '/posts';
  private posts$ = new BehaviorSubject<Post[]>(MOCK_POSTS);

  constructor(private http: HttpClient) {}

  /**
   * Get all posts
   */
  getAll(): Observable<Post[]> {
    return of(this.posts$.value);
  }

  /**
   * Get post by ID
   */
  getById(id: string): Observable<Post> {
    const post = this.posts$.value.find(p => p.id === id);
    return of(post!);
  }

  /**
   * Get posts by category
   */
  getByCategory(category: string): Observable<Post[]> {
    const filtered = this.posts$.value.filter(p => p.category === category);
    return of(filtered);
  }

  /**
   * Get posts by author
   */
  getByAuthor(authorId: string): Observable<Post[]> {
    const filtered = this.posts$.value.filter(p => p.authorId === authorId);
    return of(filtered);
  }

  /**
   * Search posts
   */
  search(query: string): Observable<Post[]> {
    const results = this.posts$.value.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );
    return of(results);
  }

  /**
   * Get trending posts (sorted by likes and views)
   */
  getTrending(): Observable<Post[]> {
    const sorted = [...this.posts$.value].sort((a, b) => {
      const scoreA = (a.likes || 0) + ((a.views || 0) * 0.1);
      const scoreB = (b.likes || 0) + ((b.views || 0) * 0.1);
      return scoreB - scoreA;
    });
    return of(sorted);
  }

  /**
   * Create new post
   */
  create(data: Partial<Post>): Observable<Post> {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: data.title || '',
      content: data.content || '',
      author: data.author || '',
      authorId: data.authorId || '',
      authorImage: data.authorImage || '',
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      category: data.category || 'discussion',
      views: 0,
      shares: 0,
    };

    const currentPosts = this.posts$.value;
    this.posts$.next([...currentPosts, newPost]);
    return of(newPost);
  }

  /**
   * Update post
   */
  update(id: string, data: Partial<Post>): Observable<Post> {
    const currentPosts = this.posts$.value;
    const index = currentPosts.findIndex(p => p.id === id);

    if (index > -1) {
      const updatedPost: Post = {
        ...currentPosts[index],
        ...data,
        updatedAt: new Date(),
      };
      currentPosts[index] = updatedPost;
      this.posts$.next([...currentPosts]);
      return of(updatedPost);
    }

    return of(data as Post);
  }

  /**
   * Delete post
   */
  delete(id: string): Observable<void> {
    const currentPosts = this.posts$.value;
    this.posts$.next(currentPosts.filter(p => p.id !== id));
    return of(void 0);
  }

  /**
   * Like a post
   */
  likePost(id: string): Observable<Post> {
    const currentPosts = this.posts$.value;
    const post = currentPosts.find(p => p.id === id);

    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.posts$.next([...currentPosts]);
      return of(post);
    }

    return of({} as Post);
  }

  /**
   * Add comment to post
   */
  addComment(postId: string, comment: any): Observable<Post> {
    const currentPosts = this.posts$.value;
    const post = currentPosts.find(p => p.id === postId);

    if (post) {
      const newComment = {
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: new Date(),
        likes: 0,
      };
      post.comments.push(newComment);
      this.posts$.next([...currentPosts]);
      return of(post);
    }

    return of({} as Post);
  }

  /**
   * Increment view count
   */
  incrementView(id: string): Observable<Post> {
    const currentPosts = this.posts$.value;
    const post = currentPosts.find(p => p.id === id);

    if (post) {
      post.views = (post.views || 0) + 1;
      this.posts$.next([...currentPosts]);
      return of(post);
    }

    return of({} as Post);
  }
}
