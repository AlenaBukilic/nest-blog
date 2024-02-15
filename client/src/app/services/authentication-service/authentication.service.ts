import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/users.model';

export interface LoginForm {
  email: string;
  password: string;
}

export const JWT_NAME = 'app-token';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly url = {
    login: () => `/api/users/login`,
    register: () => `/api/users/`,
  };
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(loginForm: LoginForm) {
    return this.http
      .post<any>(this.url.login(), {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          localStorage.setItem(JWT_NAME, token.access_token);
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

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    return !this.jwtHelper.isTokenExpired(token);
  }
}
