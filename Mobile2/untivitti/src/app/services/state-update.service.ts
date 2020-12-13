import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStateModel, PlayerModel } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class StateUpdateService {

  endpoint = 'ws://2.238.108.96:3000';

  websocket: WebSocket;

  uuid: string;

  stateListener: BehaviorSubject<GameStateModel>;

  constructor() {}

  public initWebSocket(state: GameStateModel, player: PlayerModel): BehaviorSubject<GameStateModel> {
    this.websocket = new WebSocket(this.endpoint);
    this.subscribeUpdate(player.name, state.code);
    this.stateListener = new BehaviorSubject<GameStateModel>(state);
    return this.stateListener;
  }

  private subscribeUpdate(nick: string, code: string) {
    this.websocket.onopen = () => {
      this.websocket.send(JSON.stringify({type: 'init', nick, code}));
      this.websocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'init':
            this.uuid = msg.uuid;
            break;
          case 'update':
            this.stateListener.next(msg.state);
            break;
          case 'move':
            break;
          default:
            this.stateListener.next(undefined);
            console.log(msg);
        }
      };
      this.websocket.onclose = () => {
        this.stateListener.next(undefined);
      };
    };
  }

  public sendMove(move: number) {
    if (this.websocket) {
      this.websocket.send(JSON.stringify({type: 'move', uuid: this.uuid, move}));
    }
  }

  public closeWebSocket() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
