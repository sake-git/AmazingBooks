import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { UserApiService } from './user-api.service';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private userApi: UserApiService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('accessToken');

    //    localStorage.removeItem('RefreshToken');
    if (
      token &&
      req.url.includes('https://localhost:7186/api') &&
      !req.url.includes('https://localhost:7186/api/Users/RefreshToken')
    ) {
      console.log('Inside interceptor to modify the header');
      let modifiedRequest = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });

      return next.handle(modifiedRequest).pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error('Unauthorized request:', error);
            if (token != null) {
              return this.handleTokenExpired(modifiedRequest, next);
            }
          }
          return throwError(() => new Error(error));
        })
      );
    }

    return next.handle(req);
  }

  handleTokenExpired(req: HttpRequest<any>, next: HttpHandler) {
    // Call the refresh token endpoint to get a new access token
    console.log('Handle Token Expired called:');
    let user = this.userApi.GetUserIdFromLocal();
    return this.userApi.RefreshToken(user).pipe(
      switchMap(() => {
        console.log('After token refresh:', user);
        const newAccessToken = localStorage.getItem('accessToken');
        // Retry the original request with the new access token
        let modifiedRequest = req.clone({
          setHeaders: { Authorization: 'Bearer ' + newAccessToken },
        });
        return next.handle(modifiedRequest);
      }),
      catchError((error) => {
        // Handle refresh token error (e.g., redirect to login page)
        console.error('Error handling expired access token:', error);
        if (error.status === 401) {
          console.log('inside modified request 401');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          this.router.navigate(['/login', { error: 'Session Expired' }]);
        }
        return throwError(() => new Error(error));
      })
    );
  }
}
