import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly url = {
    login: () => `/api/users/login`,
  };
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(this.url.login(), { email, password }).pipe(
      map((token) => {
        localStorage.setItem('app-token', token.access_token);
        return token;
      }),
    );
  }
}
