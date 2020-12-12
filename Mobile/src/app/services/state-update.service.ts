import { Injectable } from '@angular/core';
import { WebSocketServer } from '@ionic-native/web-socket-server';
import { BehaviorSubject } from 'rxjs';
import { GameStateModel, PlayerModel } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class StateUpdateService {

  endpoint = 'ws://localhost:3000';

  websocket: WebSocket;

  uuid: string;

  stateListener: BehaviorSubject<GameStateModel>;

  constructor() {}

  public initWebSocket(state: GameStateModel, player: PlayerModel): BehaviorSubject<GameStateModel> {
    this.websocket = new WebSocket(this.endpoint);
    this.subscribeUpdate(state.code, player.name);
    this.stateListener = new BehaviorSubject<GameStateModel>(state);
    return this.stateListener;
  }

  private subscribeUpdate(code: string, nick: string) {
    this.websocket.onopen = () => {
      this.websocket.send(JSON.stringify({code, nick}));
      this.websocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'init':
            this.uuid = msg.uuid;
            break;
          case 'update':
            this.stateListener.next(msg.state);
            break;
          default:
            console.log(msg);
        }
      };
      this.websocket.onclose = () => {
        this.stateListener.next(undefined);
      };
    };
  }

  public closeWebSocket() {
    this.websocket.close();
  }
}
