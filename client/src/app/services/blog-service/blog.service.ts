import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Blog, BlogsPaginated } from '../../models/blogs.model';

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

  create(blog: Blog): Observable<Blog> {
    return this.http.post(this.url.index(), blog).pipe(
        map((blog) => {
            return blog as Blog;
        }),
        catchError((err: Error) => {
            return throwError(() => err);
        }),
    );
  }

  uploadBlogImage(formData: FormData): Observable<any> {
    return this.http
      .post(this.url.index() + 'upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err: Error) => {
          return throwError(() => err);
        }),
      );
  }
}
