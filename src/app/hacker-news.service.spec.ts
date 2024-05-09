import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HackerNewsService, Story, HackerNewsResponse } from './hacker-news.service';

describe('HackerNewsService', () => {

  let apiUrl = 'http://localhost:5227';

  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  const mockStories: Story[] = [
    { id: 1, title: 'Test Story 1', url: 'http://example.com/1' },
    { id: 2, title: 'Test Story 2', url: 'http://example.com/2' }
  ];

  const mockResponse: HackerNewsResponse = {
    stories: mockStories,
    totalStories: 2
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService]
    });

    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stories successfully', () => {
    service.getStories(1, 10, 'Test').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/Stories?pageNumber=1&pageSize=10&title=Test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle errors gracefully', () => {
    const errorMessage = 'Something bad happened; please try again later.';

    service.getStories(1, 10, '').subscribe(
      () => fail('expected an error, not stories'),
      (error) => expect(error).toBe(errorMessage)
    );

    const req = httpMock.expectOne(`${apiUrl}/Stories?pageNumber=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });
});
