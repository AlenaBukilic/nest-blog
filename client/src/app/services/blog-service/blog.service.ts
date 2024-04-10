import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BlogsPaginated } from '../../models/blogs.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private readonly url = {
    index: () => `/api/blogs/`,
  };

  constructor(private http: HttpClient ) { }

  indexAll(page: number, limit: number): Observable<BlogsPaginated> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));

    return this.http.get(this.url.index(), { params }).pipe(
        map((blogs) => {
            return blogs as BlogsPaginated;
        }),
        catchError((err: Error) => {
            return throwError(() => err);
        }),
    );
  }
}
