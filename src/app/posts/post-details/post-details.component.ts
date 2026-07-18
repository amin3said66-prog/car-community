import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../models/post.model';
import { PostService, NewComment } from '../post.service';

const GUEST_AVATAR = 'https://i.pravatar.cc/150?img=5';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss'],
})
export class PostDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly postService = inject(PostService);

  post: Post | null = null;
  loading = false;
  notFound = false;
  newComment = '';

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const postId = params['id'] as string | undefined;
      if (!postId) {
        this.notFound = true;
        return;
      }

      this.loading = true;
      this.postService.incrementView(postId).subscribe();
      this.postService.getById(postId).subscribe({
        next: (post: Post | undefined) => {
          this.post = post ?? null;
          this.notFound = !post;
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
    const map: Record<string, string> = { discussion: '💬', advice: '💡', news: '📰', showcase: '🏆' };
    return map[cat] ?? '📝';
  }

  likePost(): void {
    if (this.post) {
      this.postService.likePost(this.post.id).subscribe(updated => {
        if (updated) this.post = updated;
      });
    }
  }

  addComment(): void {
    if (!this.post || !this.newComment.trim()) return;

    const comment: NewComment = {
      author: 'Current User',
      authorId: 'current-user',
      authorImage: GUEST_AVATAR,
      content: this.newComment.trim(),
    };

    this.postService.addComment(this.post.id, comment).subscribe(updated => {
      if (updated) this.post = updated;
    });
    this.newComment = '';
  }

  stars(rating: number): string {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }
}
