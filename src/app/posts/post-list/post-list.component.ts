import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImgFallbackDirective } from '../../shared/img-fallback.directive';
import { Post } from '../../models/post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, ImgFallbackDirective],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  private readonly postService = inject(PostService);

  posts: Post[] = [];
  filtered: Post[] = [];
  search = '';
  activeCategory = '';

  readonly categories = ['', 'discussion', 'advice', 'news', 'showcase'];

  ngOnInit(): void {
    this.postService.getAll().subscribe({
      next: (posts) => { this.posts = posts; this.filtered = posts; },
    });
  }

  applyFilters(): void {
    let result = this.posts;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
      );
    }
    if (this.activeCategory) result = result.filter(p => p.category === this.activeCategory);
    this.filtered = result;
  }

  setCategory(cat: string): void { this.activeCategory = cat; this.applyFilters(); }

  /** Returns a Material Icon name for the given post category */
  catIcon(cat: string): string {
    const map: Record<string, string> = {
      discussion: 'forum',
      advice:     'lightbulb',
      news:       'newspaper',
      showcase:   'emoji_events',
    };
    return map[cat] ?? 'article';
  }

  likePost(post: Post, e: Event): void {
    e.preventDefault();
    this.postService.likePost(post.id).subscribe();
  }
}
