import { Component, OnInit, computed, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HackerNewsService, Story } from '../hacker-news.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {

  stories = signal<Story[]>([]);
  totalStories = signal(0);
  currentPage = signal(1);
  pageSize = 10;
  searchQuery = signal('');

  totalPages = computed(() => Math.ceil(this.totalStories() / this.pageSize));

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.hackerNewsService.getStories(this.currentPage(), this.pageSize, this.searchQuery())
      .subscribe(
        response => {
          this.stories.set(response.stories);
          this.totalStories.set(response.totalStories);
        },
        error => {
          console.error('Error loading stories:', error);
        }
      );
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    
    this.currentPage.set(page);
    this.loadStories();
  }

  onSearchQueryChange(value: string): void {
    this.searchQuery.set(value.trim());
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadStories();
  }
}
