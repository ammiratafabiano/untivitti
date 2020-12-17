import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { ApiService } from '../services/api.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { NotificationIcons, NotificationModel } from '../models/notification.model';
import { CardTypeEnum } from '../models/card-set.model';
import { TutorialPage } from '../tutorial/tutorial.page';

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

  reordering = false;

  status = true;
  cardSet: CardTypeEnum;

  moneyMode: boolean;

  ground: number[];

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
    private clipboard: Clipboard,
    private notificationService: NotificationService,
    public alertController: AlertController) {
    const stateListener = this.navParams.get('state');
    const nickname = this.navParams.get('nickname');
    stateListener.subscribe(value => {
      if (!this.reordering && this.detectChange(this.players, value.players)) {
        this.players = value.players;
        this.code = value.code;
        this.currentPlayer = value.players.find(x => x.name === nickname);
        this.status = value.status;
        this.cardSet = value.cardSet;
        this.moneyMode = value.money;
        this.ground = value.ground;
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
    const link = this.api.clientEndpoint + '?code=' + this.code;
    this.clipboard.copy(link);
    // Web App
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const notification: NotificationModel = new NotificationModel();
    this.notificationService.addNotification('Link copiato negli appunti');
  }

  remove(player: PlayerModel) {
    this.api.exitGroup(player.name, this.code).subscribe(_ => {});
  }

  async changeBalance(player: PlayerModel) {
    const alert = await this.alertController.create({
      header: 'Cambio bilancio',
      inputs: [
        {
          name: 'value',
          value: player.balance,
          type: 'number',
          min: 0
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Conferma',
          handler: (out) => {
            this.api.updateBalance(player.name, this.code, out.value).subscribe(_ => {

            });
          }
        }
      ]
    });

    await alert.present();
  }

  setGhost(player, value) {
    this.api.setGhost(player.name, this.code, value).subscribe(_ => {});
  }

  async openTutorialModal() {
    const tutorialModal = await this.modalController.create({
      component: TutorialPage,
      componentProps: { type: 'CUCU_PLAYERS_PAGE' }
    });
    tutorialModal.present();
  }

}
