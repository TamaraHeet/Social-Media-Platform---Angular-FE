import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorhandlingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 || error.status === 204) {
          return new Observable<HttpEvent<unknown>>((observer) => {
            observer.next(
              new HttpResponse({ body: null, status: error.status })
            );
            observer.complete();
          });
        }

        console.log('Intercepted error:', error);

        let msg = '';

        switch (error.status) {
          case 404:
            msg = 'Resource not found!';
            break;
          case 401:
            msg = 'Unauthorized access. Please log in!';
            break;
          case 500:
            msg = 'Internal Server Error. Please try again later.';
            break;
          default:
            msg = 'Oops, something went wrong :(';
            break;
        }

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: msg,
          showConfirmButton: false,
          timer: 5000,
        });

        return throwError(() => new Error(msg));
      })
    );
  }
}
