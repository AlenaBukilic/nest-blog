import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PaginationData } from '../../../../../src/types/types.exporter';
import { User } from '../../../app/models/users.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = {
    index: () => `/api/users/`,
  };
  constructor(private http: HttpClient) {}

  findOne(id: string): Observable<User> {
    return this.http.get(this.url.index() + id).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }

  updateOne(id: string, user: User): Observable<User> {
    return this.http.patch(this.url.index() + id, user).pipe(
      map((user: User) => {
        return user;
      }),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }

  findAll(
    page: number,
    limit: number,
    username: string | undefined,
  ): Observable<PaginationData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    if (username) {
      params = params.append('username', username);
    }

    return this.http.get(this.url.index(), { params }).pipe(
      map((paginationData) => {
        return paginationData as PaginationData;
      }),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }
}
