import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../app/models/users.model';
import { Observable, of } from 'rxjs';

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

  logout() {
    localStorage.removeItem(JWT_NAME);
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

  getUserId(): Observable<string>{
    return of(localStorage.getItem(JWT_NAME)).pipe(
      switchMap((token: string | null) => of(this.jwtHelper.decodeToken(token as string)).pipe(
        map((token: any) => token.user.id)
      )
    ));
  }
}
