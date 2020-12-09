import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PlayerModel } from '../models/game-state.model';
import { ApiService } from '../services/api.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { NotificationModel } from '../models/notification.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  code: string;
  currentPlayer: PlayerModel;
  players: PlayerModel[];
  loop: any;

  reordering = false;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
    private clipboard: Clipboard,
    private notificationService: NotificationService) {
    this.players = this.navParams.get('state').players;
    this.code = this.navParams.get('state').code;
    this.currentPlayer = this.navParams.get('player');
  }

  ngOnInit() {
    this.startLoop();
  }

  dismiss() {
    this.stopLoop();
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

  private startLoop() {
    this.loop = setInterval(_ => {
      if (!this.reordering) {
        this.updateState();
      }
    }, 1000);
  }

  private stopLoop() {
    clearInterval(this.loop);
  }

  private updateState() {
    return this.api.getState(this.currentPlayer.name, this.code).subscribe(
      response => {
        if (response.success && response.data) {
          if (!this.reordering && this.detectChange(this.players, response.data.players)) {
            this.players = response.data.players;
          }
        } else {
          this.dismiss();
        }
      },
      err => {
        this.dismiss();
      }
    );
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
    notification.message = 'Link was copied in clipboard';
    this.notificationService.addNotification(notification);
  }

}
