import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { GameModel, GameTypeEnum } from '../models/game.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  endpoint = 'http://2.238.108.96:3000';
  clientEndpoint = 'http://localhost:8100/untivitti';

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

  getCardSets(): Observable<ResponseModel<CardSetModel[]>>{
    return this.http
      .get<ResponseModel<CardSetModel[]>>(this.endpoint + '/getCardSets')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getGames(): Observable<ResponseModel<GameModel[]>>{
    return this.http
      .get<ResponseModel<GameModel[]>>(this.endpoint + '/getGames')
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  createGroup(nickname: string, cardSet: CardTypeEnum, game: GameTypeEnum, money: boolean): Observable<ResponseModel<GameStateModel>>{
    return this.http
      .post<ResponseModel<any>>(this.endpoint + '/createGroup', { nickname, cardSet, game, money })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  joinGroup(nickname: string, code: string): Observable<ResponseModel<GameStateModel>>{
    return this.http
      .get<ResponseModel<any>>(this.endpoint + '/joinGroup/' + nickname + '/' + code)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  exitGroup(nickname: string, code: string): Observable<ResponseModel<any>>{
    return this.http
      .get<ResponseModel<any>>(this.endpoint + '/exitGroup/' + nickname + '/' + code)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  updatePlayers(players: PlayerModel[], code: string): Observable<ResponseModel<any>>{
    return this.http
      .post<ResponseModel<any>>(this.endpoint + '/updatePlayers', { players, code })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  updateBalance(nickname: string, code: string, newBalance: number): Observable<ResponseModel<any>>{
    return this.http
      .get<ResponseModel<GameStateModel>>(this.endpoint + '/updateBalance/' + nickname + '/' + code + '/' + newBalance)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  setGhost(nickname: string, code: string, value: boolean): Observable<ResponseModel<any>>{
    return this.http
      .get<ResponseModel<GameStateModel>>(this.endpoint + '/setGhost/' + nickname + '/' + code + '/' + value)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}
