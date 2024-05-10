import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewsListComponent } from './news-list.component';
import { HackerNewsResponse, HackerNewsService } from '../hacker-news.service';
import { of, throwError } from 'rxjs';

describe('NewsListComponent', () => {

  let component: NewsListComponent;
  let service: HackerNewsService;
  let spy: jasmine.Spy;

  const mockStories: HackerNewsResponse = {
    stories: [
      { id: 1, title: 'Test Story 1', url: 'http://example1.com' },
      { id: 2, title: 'Test Story 2', url: 'http://example2.com' }
    ],
    totalStories: 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListComponent, HttpClientModule, FormsModule],
      providers: [HackerNewsService]
    })
      .compileComponents();

    service = TestBed.inject(HackerNewsService);
    component = TestBed.createComponent(NewsListComponent).componentInstance;
  });

  it('should load stories correctly from the service', () => {
    spy = spyOn(service, 'getStories').and.returnValue(of(mockStories));
    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(1, 10, '');
    expect(component.stories()).toEqual(mockStories.stories);
    expect(component.totalStories()).toEqual(mockStories.totalStories);
  });

  it('should handle error when loading stories fails', () => {
    const consoleSpy = spyOn(console, 'error');
    spy = spyOn(service, 'getStories').and.returnValue(throwError(() => new Error('Error loading stories')));
    component.loadStories();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading stories:', jasmine.any(Error));
  });

  it('should not change page if the new page number is out of valid range', () => {
    component.currentPage.set(1);
    component.onPageChange(0);

    expect(component.currentPage()).toEqual(1);

    component.onPageChange(component.totalPages() + 1);

    expect(component.currentPage()).toEqual(1);
  });

  it('should change page and load stories', () => {
    const mockCurrentPage = 1;
    component.totalStories.set(50);

    spy = spyOn(component, 'loadStories');
    component.onPageChange(mockCurrentPage + 1);

    expect(component.currentPage()).toEqual(mockCurrentPage + 1);
    expect(spy).toHaveBeenCalled();
  });

  it('should reset to page 1 and load stories on search', () => {
    const searchQuery = 'test';
    spy = spyOn(component, 'loadStories');

    component.onSearchQueryChange(searchQuery);
    component.onSearch();

    expect(component.searchQuery()).toBe(searchQuery.trim());
    expect(component.currentPage()).toEqual(1);
    expect(spy).toHaveBeenCalled();
  });

});
