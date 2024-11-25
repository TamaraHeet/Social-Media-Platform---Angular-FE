import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = localStorage.getItem('mySecurityKey');
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: 'Bearer ${myToken}' },
      });
    }
    return next.handle(request);
  }
}
