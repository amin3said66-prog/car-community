import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { MOCK_POSTS } from '../../data/mock-posts';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  post: Post | null = null;
  loading = false;
  newComment = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params: any) => {
      const postId = params['id'];
      if (postId) {
        // Simulate finding post from mock data
        const found = MOCK_POSTS.find(p => p.id === postId);
        if (found) {
          this.post = found;
        }
        this.loading = false;
      }
    });
  }

  catIcon(cat: string): string {
    const map: Record<string, string> = { discussion: '💬', advice: '💡', news: '📰', showcase: '🏆' };
    return map[cat] ?? '📝';
  }

  likePost(): void {
    if (this.post) {
      this.post.likes++;
    }
  }

  addComment(): void {
    if (this.post && this.newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        authorId: 'current-user',
        authorImage: 'https://i.pravatar.cc/150?img=5',
        content: this.newComment,
        createdAt: new Date(),
        likes: 0
      };
      this.post.comments.push(comment);
      this.newComment = '';
    }
  }

  stars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}
