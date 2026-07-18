import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  private readonly postService = inject(PostService);

  posts: Post[] = [];
  filtered: Post[] = [];
  search = '';
  activeCategory = '';
  error: string | null = null;

  readonly categories = ['', 'discussion', 'advice', 'news', 'showcase'];

  ngOnInit(): void {
    this.postService.getAll().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.filtered = posts;
      },
      error: () => {
        this.error = 'Failed to load posts. Please try again.';
      },
    });
  }

  applyFilters(): void {
    let result = this.posts;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(
        p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      );
    }
    if (this.activeCategory) {
      result = result.filter(p => p.category === this.activeCategory);
    }
    this.filtered = result;
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  catIcon(cat: string): string {
    const map: Record<string, string> = { discussion: '💬', advice: '💡', news: '📰', showcase: '🏆' };
    return map[cat] ?? '📝';
  }

  likePost(post: Post, e: Event): void {
    e.preventDefault();
    this.postService.likePost(post.id).subscribe();
  }
}
