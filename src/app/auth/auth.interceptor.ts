import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshAndProceed = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: HttpHandlerFn,
  ) => {
    if (!isRefreshing) {
      isRefreshing = true;
      return authService.refreshAuthToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          return next(req);
        }),
      );
    }
    return authService.refreshAuthToken().pipe(switchMap(() => next(req))); // Повторяем запрос меняя стрим
  };

  const authService = inject(AuthService);
  const token = authService.accessToken;
  if (isRefreshing) return refreshAndProceed(authService, req, next);
  if (token)
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }); // Добавляем header с токеном
  return next(req).pipe(
    catchError((err) => {
      if (err.status === 403) {
        console.log('Refresh token');
        return refreshAndProceed(authService, req, next);
      }
      return throwError(() => err);
    }),
  );
};
