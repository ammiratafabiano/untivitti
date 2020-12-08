import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { GameStateModel } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  endpoint = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getState(code: string): Observable<GameStateModel>{
    return this.http
      .get<GameStateModel>(this.endpoint + '/getState/' + code)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}
