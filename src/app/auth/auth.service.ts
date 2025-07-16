import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthResponse } from '../data/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private username$ = new BehaviorSubject<string | null>(null); // Чтобы получать username реактивно, нужно подписаться

  setUsername(username: string) {
    this.username$.next(username); // Сохраняем только в памяти
  }

  getUsername$(): Observable<string | null> {
    return this.username$.asObservable(); //Возвращает Observable-версию BehaviorSubject, чтобы нельзя было изменить
  }

  constructor() {}

  http: HttpClient = inject(HttpClient);
  router = inject(Router);
  cookieService = inject(CookieService); // Для хранения токенов в cookie
  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  accessToken: string | null = null;
  refreshToken: string | null = null;

  get isAuth() {
    if (!this.accessToken)
      this.accessToken = this.cookieService.get('access_token');
    this.refreshToken = this.cookieService.get('refresh_token');
    return !!this.accessToken;
  }

  login(payload: { username: string; password: string }) {
    const fd = new FormData(); // Создаём FormData потому что endpoint принимает FormData x-www-form-urlencoded
    fd.append('username', payload.username);
    fd.append('password', payload.password);
    return this.http
      .post<AuthResponse>(`${this.baseApiUrl}auth/token`, fd)
      .pipe(
        tap((val) => {
          this.saveTokens(val);
          this.setUsername(payload.username);
        }),
      );
  }

  refreshAuthToken() {
    return this.http
      .post<AuthResponse>(`${this.baseApiUrl}refresh`, {
        refresh_token: this.refreshToken,
      })
      .pipe(
        tap((val) => {
          this.saveTokens(val);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        }),
      );
  }

  logout() {
    this.username$.next(null);
    this.accessToken = null;
    this.refreshToken = null;
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.router.navigate(['/login']);
  }

  saveTokens(tokens: AuthResponse) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.cookieService.set('access_token', tokens.access_token);
    this.cookieService.set('refresh_token', tokens.refresh_token);
  }
}
