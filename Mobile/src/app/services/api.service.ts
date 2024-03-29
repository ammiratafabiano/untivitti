import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { GameStateModel } from '../models/game-state.model';
import { GameModel, GameTypeEnum } from '../models/game.model';
import { PlayerModel } from '../models/player.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  endpoint = 'https://ammiratafabiano.dev:3442';
  clientEndpoint = 'https://untivitti.ammiratafabiano.dev';

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

  getCardSets(extraSet?): Observable<ResponseModel<CardSetModel[]>>{
    extraSet = extraSet ? extraSet : 'NONE';
    return this.http
      .get<ResponseModel<CardSetModel[]>>(this.endpoint + '/getCardSets/' + extraSet)
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

  createGroup(nickname: string, cardSet: CardTypeEnum, game: GameTypeEnum,
              money: boolean, balance: number, minBet: number, maxBet: number, decks: number): Observable<ResponseModel<GameStateModel>>{
    return this.http
      .post<ResponseModel<any>>(this.endpoint + '/createGroup', { nickname, cardSet, game, money, balance, minBet, maxBet, decks })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  joinGroup(nickname: string, code: string): Observable<ResponseModel<any>>{
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

  retrieveSession(uuid: string): Observable<ResponseModel<any>>{
    return this.http
      .get<ResponseModel<GameStateModel>>(this.endpoint + '/retrieveSession/' + uuid)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  placeBet(nickname: string, code: string, value: number): Observable<ResponseModel<any>>{
    return this.http
      .post<ResponseModel<any>>(this.endpoint + '/placeBet', { nickname, code, value })
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

}
