import {HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

export abstract class ErrorHandlingEnabledBaseType {
  protected handleError = (operation: string) =>
    (error: HttpErrorResponse): Observable<never> => {
      let errorMessage: string;
      if (error.status === 0) {
        errorMessage = 'errors.network';
      } else if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.status || 'Unexpected error'}`;
      }
      return throwError(() => new Error(errorMessage));
    };
}
