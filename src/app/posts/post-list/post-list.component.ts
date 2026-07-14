import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MOCK_POSTS } from '../../data/mock-posts';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filtered: Post[] = [];
  search = '';
  activeCategory = '';

  categories = ['', 'discussion', 'advice', 'news', 'showcase'];

  ngOnInit(): void {
    this.posts = MOCK_POSTS;
    this.filtered = MOCK_POSTS;
  }

  applyFilters(): void {
    let result = this.posts;
    if (this.search.trim()) {
      const q = this.search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
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
    post.likes++;
  }
}
