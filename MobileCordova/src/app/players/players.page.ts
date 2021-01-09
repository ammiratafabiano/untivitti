import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { NotificationModel } from '../models/notification.model';
import { CardSetModel } from '../models/card-set.model';
import { TutorialPage } from '../tutorial/tutorial.page';
import { LoaderService } from '../services/loader.service';
import { GameModel } from '../models/game.model';
import { PlayerModel } from '../models/player.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  code: string;
  currentPlayer: PlayerModel;
  players: PlayerModel[] = [];

  reordering = false;

  status = true;
  cardSet: CardSetModel;
  game: GameModel;

  moneyMode: boolean;

  ground: number[];

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    private api: ApiService,
    private notificationService: NotificationService,
    public alertController: AlertController,
    private loaderService: LoaderService) {
    const stateListener = this.navParams.get('state');
    const nickname = this.navParams.get('nickname');
    this.cardSet = this.navParams.get('cardSet');
    this.game = this.navParams.get('game');
    stateListener.subscribe(value => {
      if (!this.reordering && this.detectChange(this.players, value.players)) {
        this.players = value.players;
        this.code = value.code;
        this.currentPlayer = value.players.find(x => x.name === nickname);
        this.status = value.status;
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
    if (ev.detail.to < this.players.length) {
      this.loaderService.show().then(_ => {
        this.reordering = true;
        const itemMove = this.players.splice(ev.detail.from, 1)[0];
        this.players.splice(ev.detail.to, 0, itemMove);
        if (this.game.teams) {
          if (ev.detail.to < ev.detail.from) {
            this.players[ev.detail.to].team = this.players[ev.detail.to + 1].team;
          } else {
            this.players[ev.detail.to].team = this.players[ev.detail.to - 1].team;
          }
        }
        ev.detail.complete();
        this.api.updatePlayers(this.players, this.code)
        .pipe(finalize(() => {
          this.reordering = false;
          this.loaderService.hide();
        }
        )).subscribe();
      });
    } else {
      ev.detail.complete();
    }
  }

  detectChange(list1, list2) {
    list1.forEach(x => x.timestamp = undefined);
    list2.forEach(x => x.timestamp = undefined);
    return JSON.stringify(list1) !== JSON.stringify(list2);
  }

  shareLink() {
    const link = this.api.clientEndpoint + '?code=' + this.code;
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
    this.loaderService.show().then(_ => {
      this.api.exitGroup(player.name, this.code)
      .pipe(finalize(() => this.loaderService.hide() ))
        .subscribe();
    });
  }

  async changeBalance(player: PlayerModel, error?) {
    const alert = await this.alertController.create({
      header: 'Cambio bilancio',
      subHeader: error ? error : undefined,
      inputs: [
        {
          name: 'value',
          value: player.balance,
          type: 'number'
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
            this.setBalance(player, out.value);
          }
        }
      ]
    });

    await alert.present();
  }

  setGhost(player: PlayerModel, value) {
    this.loaderService.show().then(_ => {
      this.api.setGhost(player.name, this.code, value)
      .pipe(finalize(() => this.loaderService.hide() ))
        .subscribe();
    });
  }

  async openTutorialModal() {
    const tutorialModal = await this.modalController.create({
      component: TutorialPage,
      componentProps: { type: 'PLAYERS_PAGE', game: this.game.id }
    });
    tutorialModal.present();
  }

  setBalance(player: PlayerModel, value) {
    this.loaderService.show().then(_ => {
      this.api.updateBalance(player.name, this.code, value)
      .pipe(finalize(() => this.loaderService.hide() ))
        .subscribe(response => {
          if (!response.success) {
            this.changeBalance(player, response.errorCode);
          }
        });
    });
  }

  onClickPay(player?: PlayerModel) {
    if (player && this.game.fixedDealer) {
      const bet = player.bet;
      if (player.haveToPay) {
        const negative = player.balance - bet;
        this.updateBalance(player, negative);
        const positive = this.currentPlayer.balance + bet;
        this.updateBalance(this.currentPlayer, positive);
      }
      if (player.haveToBePaid) {
        const negative = this.currentPlayer.balance - bet;
        this.updateBalance(this.currentPlayer, negative);
        const positive = player.balance + bet;
        this.updateBalance(player, positive);
      }
    } else {
      const value = this.currentPlayer.balance -= 1;
      this.updateBalance(this.currentPlayer, value);
    }
  }

  updateBalance(player: PlayerModel, value: number) {
    if (value !== undefined) {
      this.loaderService.show().then(_ => {
        this.api.updateBalance(player.name, this.code, value).subscribe(() => {
          let attempt = 0;
          const payment = setInterval(() => {
            attempt += 1;
            const currentPlayer = this.players.find(x => x.name === player.name);
            console.log(attempt, player, currentPlayer, value);
            if (currentPlayer.balance === value || attempt === 4) {
              clearInterval(payment);
              this.loaderService.hide();
            }
          }, 500);
        });
      });
    }
  }

  getTeamSize(team) {
    return this.players.filter(x => x.team === team).length;
  }
}
