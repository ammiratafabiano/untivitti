import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { NotificationIcons } from '../models/notification.model';
import { ImpressedTextService } from './impressed-text.service';
import { NotificationService } from './notification.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class StateUpdateService {

  endpoint = 'ws://2.238.108.96:3000';

  websocket: WebSocket;

  uuid: string;

  stateListener: BehaviorSubject<GameStateModel>;

  constructor(
    private notificationService: NotificationService,
    private utils: UtilsService,
    private impressedTextService: ImpressedTextService) {}

  public initConnection(state: GameStateModel, player: PlayerModel): BehaviorSubject<GameStateModel> {
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
            this.utils.setStorage('uuid', this.uuid);
            break;
          case 'update':
            this.stateListener.next(msg.state);
            break;
          case 'message':
            this.notificationService.addNotification(msg.text, NotificationIcons[msg.icon]);
            break;
          case 'move':
            break;
          case 'text':
            this.impressedTextService.addImpressedText(msg.text, msg.from);
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

  public sendMove(move: number) {
    if (this.websocket) {
      this.websocket.send(JSON.stringify({type: 'move', uuid: this.uuid, move}));
    }
  }

  public sendText(text: string, player: PlayerModel) {
    if (this.websocket) {
      this.websocket.send(JSON.stringify({type: 'text', uuid: this.uuid, text, from: player.name}));
    }
  }

  public closeConnection() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
}
