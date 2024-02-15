import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/users.model';

export interface LoginForm {
  email: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly url = {
    login: () => `/api/users/login`,
    register: () => `/api/users/`,
  };
  constructor(private http: HttpClient) {}

  login(loginForm: LoginForm) {
    return this.http
      .post<any>(this.url.login(), {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          localStorage.setItem('app-token', token.access_token);
          return token;
        }),
      );
  }

  register(user: User) {
    return this.http.post<any>(this.url.register(), user).pipe(
      map((user) => {
        return user;
      }),
    );
  }
}
