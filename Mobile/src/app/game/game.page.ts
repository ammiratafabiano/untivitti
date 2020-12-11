import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GameStateModel, MoveModel, PlayerModel } from '../models/game-state.model';
import { GameModel } from '../models/game.model';
import { NotificationIcons } from '../models/notification.model';
import { PlayersPage } from '../players/players.page';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  loop: any;
  canUpdate: boolean = true;

  currentPlayer: PlayerModel;
  currentGame: GameModel;
  state: GameStateModel;
  prevState: GameStateModel;
  stateListener: BehaviorSubject<GameStateModel>;

  title: string;

  playerModal: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    private notificationService: NotificationService,
    public popoverController: PopoverController) {
    this.route.queryParams.subscribe(params => {
      if (params && params.group && params.player) {
        this.state = JSON.parse(params.group);
        this.stateListener = new BehaviorSubject<GameStateModel>(this.state);
        this.currentPlayer = JSON.parse(params.player);
        this.currentGame = JSON.parse(params.game);
      } else {
        this.exitGame();
      }
      this.notificationService.enableNotifications();
    });
  }

  ngOnInit() {
    if (this.state.code) {
      this.startLoop();
    }
  }

  ionViewWillLeave() {
    this.stopLoop();
  }

  private startLoop() {
    this.loop = setInterval(_ => {
      if (this.canUpdate) {
        this.updateTitle();
        this.updateState();
      }
    }, 1000);
  }

  private stopLoop() {
    clearInterval(this.loop);
  }

  private updateState() {
    this.canUpdate = false;
    return this.api.getState(this.currentPlayer.name, this.state.code).pipe(
      finalize(() => this.canUpdate = true)).subscribe(
      response => {
        if (response.success && response.data) {
          this.prevState = this.state;
          this.state = response.data;
          this.stateListener.next(this.state);
          this.currentPlayer = this.state.players.find(x => x.name == this.currentPlayer.name);
          this.checkNotifications();
        } else {
          this.exitGame();
        }
      },
      err => {
        this.exitGame();
      }
    );
  }

  private updateTitle() {
    if (this.state) {
      if (this.state.status == false) {
        if (this.state.players.length > 1) {
          this.title = 'Partita in pausa';
        } else {
          this.title = 'In attesa...';
        }
      } else {
        const player = this.state.players.find(x => x.canMove == true);
        if (player) {
          if (this.currentPlayer.canMove) {
            this.title = 'E\' il tuo turno!';
          } else {
            this.title = `E' il turno di ${ player.name }`;
          }
        } else {
          this.title = 'Giro terminato'
        }
      }
    }
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: 'Aspetta!',
      message: 'Sei proprio sicuro di volere uscire?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            this.exitGame();
          }
        }
      ]
    });
    await alert.present();
  }

  private exitGame() {
    this.stopLoop();
    if (this.playerModal) this.playerModal.dismiss();
    this.api.exitGroup(this.currentPlayer.name, this.state.code).pipe(
      finalize(() => this.router.navigate(['/']))).subscribe();
  }

  isAdmin(): boolean {
    if (this.state) {
      return this.state.players.find(x => x.name === this.currentPlayer.name).isAdmin;
    }
  }

  async openPlayersModal() {
    this.playerModal = await this.modalController.create({
      component: PlayersPage,
      componentProps: { state: this.stateListener, nickname: this.currentPlayer.name }
    });
    await this.playerModal.present();
  }

  private checkNotifications() {

    const players = this.state.players;
    const prevPlayers = this.prevState.players;
    const admin = this.state.players.find(x => x.isAdmin == true).name;
    const prevAdmin = this.prevState.players.find(x => x.isAdmin == true).name;
    // check log in
    players.forEach(player => {
      let found = false;
      prevPlayers.forEach(prevPlayer => {
        if (player.name == prevPlayer.name) {
          found = true;
        }
      });
      if (!found) {
        this.notificationService.addNotification(player.name + ' si è connesso/a', NotificationIcons.Login);
      }
    });
    // check log out
    prevPlayers.forEach(prevPlayer => {
      let found = false;
      players.forEach(player => {
        if (player.name == prevPlayer.name) {
          found = true;
        }
      });
      if (!found) {
        this.notificationService.addNotification(prevPlayer.name + ' si è disconnesso/a', NotificationIcons.Logout);
      }
    });
    // check admin change
    if (admin != prevAdmin) {
      this.notificationService.addNotification(admin + ' è il nuovo mazziere', NotificationIcons.Logout);
    }
  }

  sendMove(move: MoveModel) {
    this.api.sendMove(this.currentPlayer.name, this.state.code, move.id).subscribe(_ => {});
  }

}
