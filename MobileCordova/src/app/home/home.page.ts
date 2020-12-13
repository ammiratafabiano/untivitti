import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { NotificationService } from '../services/notification.service';
import { NotificationIcons } from '../models/notification.model';
import { GameModel, GameTypeEnum } from '../models/game.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  code: string;
  nickname: string;

  selectedSet: CardTypeEnum;
  selectedGame: GameTypeEnum;
  money = false;

  currentPlayer: PlayerModel;

  cardSets: CardSetModel[];
  games: GameModel[];

  isOffline = false;

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private utils: UtilsService,
    private notificationService: NotificationService) {
      this.route.queryParams.subscribe(params => {
        if (params && params.code) {
          this.code = params.code;
        }
      });
    }

  ionViewWillEnter() {
    this.loadData();
  }

  public join() {
    if (!this.code) {
      this.presentAlert('Per favore, inserisci il codice.');
      return;
    }
    if (!this.nickname) {
      this.presentAlert('Per favore, inserisci il nickname.');
      return;
    }
    this.retrieveGroup();
  }

  public create() {
    if (!this.nickname) {
      this.presentAlert('Per favore, inserisci il nickname.');
      return;
    }
    this.getCode();
  }

  private goToGame(currentPlayer: PlayerModel, group: GameStateModel) {
    this.saveData().then(_ => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            group: JSON.stringify(group),
            player: JSON.stringify(currentPlayer),
            game: JSON.stringify(this.games.find(x => x.id === group.game))
        },
        skipLocationChange: true
      };
      this.router.navigate(['/game'], navigationExtras);
    });
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Attenzione',
      message: msg,
      buttons: ['Ok']
    });

    await alert.present();
  }

  private async saveData(): Promise<void> {
    this.utils.setStorage('nickname', this.nickname);
  }

  private loadData() {
    this.nickname = this.utils.getStorage('nickname');
    this.getCardSets();
    this.getGames();
  }

  private getCardSets() {
    this.api.getCardSets().subscribe(
      response => {
        if (response.success && response.data) {
          this.cardSets = response.data;
          this.selectedSet = this.cardSets[0].id;
        } else {
          this.setOfflineStatus();
        }
      },
      err => {
        this.setOfflineStatus();
      }
    );
  }

  private getGames() {
    this.api.getGames().subscribe(
      response => {
        if (response.success && response.data) {
          this.games = response.data;
          this.selectedGame = this.games[0].id;
        } else {
          this.setOfflineStatus();
        }
      },
      err => {
        this.setOfflineStatus();
      }
    );
  }

  private getCode() {
    this.api.createGroup(this.nickname, this.selectedSet, this.selectedGame, this.money).subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data;
        const currentPlayer = response.data.players.find(x => x.name === this.nickname);
        this.goToGame(currentPlayer, group);
      } else {
        this.presentAlert('Qualcosa non va, riprova più tardi.');
      }
    });
  }

  private retrieveGroup() {
    this.api.joinGroup(this.nickname, this.code).subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data;
        const currentPlayer = response.data.players.find(x => x.name === this.nickname);
        this.goToGame(currentPlayer, group);
      } else {
        this.presentAlert('Sembra che la partità è già cominciata o che non esiste.');
      }
    });
  }

  setOfflineStatus() {
    this.isOffline = true;
    this.notificationService.enableNotifications();
    this.notificationService.addNotification('Ops, il server non risponde', NotificationIcons.Info, 5000);
  }

  setOnlineStatus() {
    this.isOffline = false;
    this.notificationService.disableNotifications();
  }

}
