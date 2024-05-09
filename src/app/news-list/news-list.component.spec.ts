import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NewsListComponent } from './news-list.component';
import { HackerNewsService, Story } from '../hacker-news.service';
import { of } from 'rxjs';

describe('NewsListComponent', () => {

  let apiUrl = 'http://localhost:5227';

  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;
  let hackerNewsService: HackerNewsService;

  const mockStories: Story[] = [
    { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Test Story 2', url: 'http://example.com/2' }
  ];

  const hackerNewsServiceStub = {
    getStories: (page: number, pageSize: number, search: string) => of({
      stories: mockStories,
      total: 2
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NewsListComponent],
      providers: [
        { provide: HackerNewsService, useValue: hackerNewsServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    hackerNewsService = TestBed.inject(HackerNewsService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should update the search query on input change', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'Test';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.searchQuery).toBe('Test');
  });

  it('should reset to page 1 and load stories on search', () => {
    spyOn(component, 'loadStories').and.callThrough();
    component.currentPage = 2;
    component.onSearch();
    expect(component.currentPage).toBe(1);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should navigate to the previous page', () => {
    spyOn(component, 'loadStories').and.callThrough();
    component.currentPage = 2;
    component.onPageChange(1);
    expect(component.currentPage).toBe(1);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should navigate to the next page', () => {
    spyOn(component, 'loadStories').and.callThrough();
    component.currentPage = 1;
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.loadStories).toHaveBeenCalled();
  });

  it('should not navigate beyond total pages', () => {
    spyOn(component, 'loadStories').and.callThrough();
    component.totalStories = 2;
    component.pageSize = 1;
    component.currentPage = 2;
    component.onPageChange(3);
    expect(component.currentPage).toBe(2);
    expect(component.loadStories).not.toHaveBeenCalled();
  });

  it('should calculate total pages correctly', () => {
    component.totalStories = 25;
    component.pageSize = 10;
    expect(component.totalPages()).toBe(3);
  });
});
