import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PlayerModel } from '../models/game-state.model';
import { ApiService } from '../services/api.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { NotificationModel } from '../models/notification.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  loop: any;

  code: string;
  currentPlayer: PlayerModel;
  players: PlayerModel[] = [];

  reordering: boolean = false;

  status: boolean = true;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
    private clipboard: Clipboard,
    private notificationService: NotificationService) {
    const stateListener = this.navParams.get('state');
    stateListener.subscribe(value => {
      if (!this.reordering && this.detectChange(this.players, value.players)) {
        this.players = value.players;
        this.code = value.code;
        this.currentPlayer = this.navParams.get('player');
        this.status = value.status;
      }
    });
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  reorderPlayers(ev: any) {
    this.reordering = true;
    const itemMove = this.players.splice(ev.detail.from, 1)[0];
    this.players.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
    this.api.updatePlayers(this.players, this.code).pipe(
      finalize(() => this.reordering = false)).subscribe();
  }

  detectChange(list1, list2) {
    list1.forEach(x => x.timestamp = undefined);
    list2.forEach(x => x.timestamp = undefined);
    return JSON.stringify(list1) !== JSON.stringify(list2);
  }

  shareLink() {
    // Mobile App
    const link = this.api.clientEndpoint + '/join/' + this.code;
    this.clipboard.copy(link);
    // Web App
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const notification: NotificationModel = new NotificationModel();
    this.notificationService.addNotification('Link was copied in clipboard');
  }

  remove(player: PlayerModel) {
    this.api.exitGroup(player.name, this.code).subscribe();
  }

}
