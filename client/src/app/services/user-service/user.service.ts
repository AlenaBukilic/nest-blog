import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { PaginationData } from '../../../../../src/types/types.exporter';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = {
    index: () => `/api/users/`,
  };
  constructor(private http: HttpClient) {}

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
