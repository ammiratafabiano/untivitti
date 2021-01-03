import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CardSetModel } from '../models/card-set.model';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { GameStateModel } from '../models/game-state.model';
import { NotificationService } from '../services/notification.service';
import { NotificationIcons } from '../models/notification.model';
import { GameModel } from '../models/game.model';
import { JoinErrorEnum } from '../models/response.model';
import { TutorialPage } from '../tutorial/tutorial.page';
import { SessionModel } from '../models/session.model';
import { PlayerModel } from '../models/player.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  code: string;
  nickname: string;

  selectedSet: number;
  selectedGame: number;
  money = true; // TODO remove
  balance: number;
  minBet: number;
  maxBet: number;
  decks: number;

  currentPlayer: PlayerModel;

  cardSets: CardSetModel[];
  extraSet: string;
  games: GameModel[];
  filteredGames: GameModel[];

  isOffline = false;

  session: SessionModel;

  extraSetCounter = 0;

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private utils: UtilsService,
    private notificationService: NotificationService,
    public modalController: ModalController) {
      this.route.queryParams.subscribe(params => {
        if (params && params.code) {
          this.code = params.code;
          this.checkExistingSession();
        } else {
          this.checkExistingSession(true);
        }
        if (params && params.extraSet) {
          this.extraSet = params.extraSet;
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

  private goToGame(currentPlayer: PlayerModel, group: GameStateModel, cardSet: CardSetModel) {
    this.saveData().then(_ => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            group: JSON.stringify(group),
            player: JSON.stringify(currentPlayer),
            game: JSON.stringify(this.games.find(x => x.id === group.game)),
            cardSet: JSON.stringify(cardSet)
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
    if (this.nickname !== '' && this.nickname !== undefined) {
      this.utils.setStorage('nickname', this.nickname);
    }
  }

  private loadData() {
    this.nickname = this.utils.getStorage('nickname');
    this.getGames();
  }

  private getCardSets() {
    this.api.getCardSets(this.extraSet).subscribe(
      response => {
        if (response.success && response.data) {
          this.cardSets = response.data;
          const set = this.cardSets.filter(x => x.code === this.extraSet)[0];
          if (set) {
            this.selectedSet = this.cardSets.filter(x => x.code === this.extraSet)[0].id;
            if (this.extraSet) {
              this.notificationService.addNotification('Set di carte nascosto sbloccato!', NotificationIcons.Info, 4000);
            }
          } else {
            this.selectedSet = this.cardSets[0].id;
            this.notificationService.addNotification('Codice carte inesistente!', NotificationIcons.Info, 4000);
          }
          this.onCardSetSelected();
          this.onGameSelected();
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
          this.getCardSets();
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
    const selectedGame = this.filteredGames.find(x => x.id === this.selectedGame);
    this.api.createGroup(this.nickname, this.selectedSet, selectedGame.id, this.money, this.balance, this.minBet, this.maxBet, this.decks)
      .subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data;
        const currentPlayer = response.data.players.find(x => x.name === this.nickname);
        const cardSet = this.cardSets.find(x => x.id === group.cardSet);
        this.goToGame(currentPlayer, group, cardSet);
      } else {
        this.presentAlert('Qualcosa non va, riprova più tardi.');
      }
    });
  }

  private retrieveGroup() {
    this.api.joinGroup(this.nickname, this.code).subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data.group;
        const currentPlayer = group.players.find(x => x.name === this.nickname);
        const cardSet = response.data.cardSet;
        this.goToGame(currentPlayer, group, cardSet);
      } else {
        switch (response.errorCode) {
          case JoinErrorEnum.Duplicate:
            this.presentAlert('Sembra che ci sia già un giocatore con il tuo nome. Se sei tu e sei appena uscito aspetta qualche minuto prima di riprovare a entrare.');
            break;
          case JoinErrorEnum.AlreadyStarted:
            this.presentAlert('Sembra che la partità è già cominciata.');
            break;
          case JoinErrorEnum.GroupNotExists:
            this.presentAlert('Sembra che la partità non esiste.');
            break;
          case JoinErrorEnum.MaxPlayers:
            this.presentAlert('E\' stato superato il numero massimo di giocatori per questa partita');
            break;
          default:
            this.presentAlert('Errore imprevisto.');
        }
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

  async openTutorialModal() {
    const tutorialModal = await this.modalController.create({
      component: TutorialPage,
      componentProps: { type: 'HOME_PAGE', game: this.selectedGame }
    });
    tutorialModal.present();
  }

  checkExistingSession(enter = false) {
    const uuid = this.utils.getStorage('uuid');
    if (uuid) {
      this.api.retrieveSession(uuid).subscribe(response => {
        if (response.success && response.data && response.data.group
          && response.data.player && response.data.game && response.data.cardSet) {
          this.session = response.data;
          if (enter || this.session.group.code === this.code) {
            this.enterExistingSession();
          }
        } else {
          this.session = undefined;
        }
      });
    } else {
      this.session = undefined;
    }
  }

  enterExistingSession() {
    if (this.session) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            group: JSON.stringify(this.session.group),
            player: JSON.stringify(this.session.player),
            game: JSON.stringify(this.session.game),
            cardSet: JSON.stringify(this.session.cardSet)
        },
        skipLocationChange: true
      };
      this.router.navigate(['/game'], navigationExtras);
    }
  }

  closeExistingSession() {
    this.api.exitGroup(this.session.player.name, this.session.group.code).subscribe(_ => {
      this.utils.setStorage('uuid', undefined);
      this.session = undefined;
    });
  }

  reloadPage() {
    window.location.reload();
  }

  onCardSetSelectCancel() {
    this.extraSetCounter += 1;
    if (this.extraSetCounter === 3) {
      this.addCardSet();
      this.extraSetCounter = 0;
    }
  }

  async addCardSet() {
    const alert = await this.alertController.create({
      header: 'Inserisci codice mazzo da aggiungere',
      inputs: [
        {
          name: 'value',
          type: 'text',
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
            if (this.code) {
              window.location.href = '/?code=' + this.code + '&extraSet=' + out.value;
            } else {
              window.location.href = '/?extraSet=' + out.value;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  onCardSetSelected() {
    this.filteredGames = this.games.filter(x => this.cardSets.find(y => y.id === this.selectedSet).games.includes(x.id));
    this.selectedGame = this.filteredGames[0].id;
  }

  onGameSelected() {
    const game = this.games.find(x => x.id === this.selectedGame);
    this.balance = game.defaultBalance;
    this.minBet = game.minBet;
    this.maxBet = game.maxBet;
    this.decks = game.decks;
  }

}
