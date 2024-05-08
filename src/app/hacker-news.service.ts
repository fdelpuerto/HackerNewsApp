// src/app/hacker-news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from './loading.service';

export interface Story {
  id: number;
  title: string;
  url: string;
}

export interface HackerNewsResponse {
  stories: Story[];
  totalStories: number;
}

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = 'http://localhost:5227';

  constructor(private http: HttpClient, private loadingService: LoadingService) { }

  getStories(page: number, pageSize: number, search: string): Observable<HackerNewsResponse> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('title', search);
    }

    this.loadingService.show();

    return this.http.get<HackerNewsResponse>(`${this.apiUrl}/Stories`, { params })
    .pipe(
      catchError(this.handleError),
      finalize(() => this.loadingService.hide())
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
