import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { NotificationIcons, NotificationModel } from '../models/notification.model';
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

  currentPlayer: PlayerModel;
  state: GameStateModel;
  prevState: GameStateModel;

  title: string;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public modalController: ModalController,
    public alertController: AlertController,
    private notificationService: NotificationService) {
    this.route.queryParams.subscribe(params => {
      if (params && params.group && params.player) {
        this.state = JSON.parse(params.group);
        this.currentPlayer = JSON.parse(params.player);
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
      this.updateTitle();
      this.updateState();
    }, 1000);
  }

  private stopLoop() {
    clearInterval(this.loop);
  }

  private updateState() {
    return this.api.getState(this.currentPlayer.name, this.state.code).subscribe(
      response => {
        if (response.success && response.data) {
          this.prevState = this.state;
          this.state = response.data;
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
    if (this.state && this.state.players && this.state.players.length > 1) {
      this.title = 'Ready to start';
    } else {
      this.title = 'Waiting for people...';
    }
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: 'Wait!',
      message: 'Are you sure you want to quit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
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
    this.api.exitGroup(this.currentPlayer.name, this.state.code).pipe(
      finalize(() => this.router.navigate(['/']))).subscribe();
  }

  isAdmin(): boolean {
    if (this.state) {
      return this.state.players.find(x => x.name === this.currentPlayer.name).isAdmin;
    }
  }

  async openPlayersModal() {
    const modal = await this.modalController.create({
      component: PlayersPage,
      componentProps: { state: this.state, player: this.currentPlayer }
    });
    modal.onWillDismiss().then(_ => this.startLoop());
    await modal.present().then(_ => this.stopLoop());
  }

  private checkNotifications() {

    const players = this.state.players;
    const prevPlayers = this.prevState.players;
    const admin = this.state.players.find(x => x.isAdmin == true).name;
    const prevAdmin = this.prevState.players.find(x => x.isAdmin == true).name;

    console.log(players);
    console.log(prevPlayers);
    // check log in
    players.forEach(player => {
      let found = false;
      prevPlayers.forEach(prevPlayer => {
        if (player.name == prevPlayer.name) {
          found = true;
        }
      });
      if (!found) {
        console.log(player.name + ' logged in');
        this.notificationService.addNotification(player.name + ' logged in', NotificationIcons.Login);
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
        this.notificationService.addNotification(prevPlayer.name + ' logged out', NotificationIcons.Logout);
      }
    });
    // check admin change
    if (admin != prevAdmin) {
      this.notificationService.addNotification(admin + ' is the Admin now', NotificationIcons.Logout);
    }

  }

}
