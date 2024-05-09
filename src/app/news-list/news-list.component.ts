import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HackerNewsService, Story } from '../hacker-news.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {

  stories: Story[] = [];
  totalStories: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';

  constructor(private hackerNewsService: HackerNewsService) { }

  ngOnInit(): void {
    this.loadStories();
  }

  loadStories(): void {
    this.hackerNewsService.getStories(this.currentPage, this.pageSize, this.searchQuery)
      .subscribe(
        response => {
          this.stories = response.stories;
          this.totalStories = response.totalStories;
        },
        error => {
          console.error('Error loading stories:', error);
        }
      );
  }

  onPageChange(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalStories / this.pageSize)) {
      return;
    }
    
    this.currentPage = page;
    this.loadStories();
  }

  onSearchQueryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value ? input.value.trim() : '';
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadStories();
  }

  totalPages(): number {
    return Math.ceil(this.totalStories / this.pageSize);
  }
}
