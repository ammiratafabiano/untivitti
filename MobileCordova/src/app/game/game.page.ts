import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { GameStateModel, MoveModel, PlayerModel } from '../models/game-state.model';
import { GameModel } from '../models/game.model';
import { PlayersPage } from '../players/players.page';
import { ApiService } from '../services/api.service';
import { StateUpdateService } from '../services/state-update.service';
import { TutorialPage } from '../tutorial/tutorial.page';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  loop: any;

  currentPlayer: PlayerModel;
  currentGame: GameModel;
  state: GameStateModel;
  stateListener: BehaviorSubject<GameStateModel>;

  title: string;

  playerModal: any;
  automaticModal = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private updateStateService: StateUpdateService,
    private api: ApiService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.group && params.player) {
        this.state = JSON.parse(params.group);
        this.stateListener = new BehaviorSubject<GameStateModel>(this.state);
        this.currentPlayer = JSON.parse(params.player);
        this.currentGame = JSON.parse(params.game);
      } else {
        this.exitGame();
      }
      this.updateStateService.initConnection(this.state, this.currentPlayer)
      .subscribe(response => {
          if (response) {
            this.state = response;
            this.stateListener.next(this.state);
            const updatedCurrentPlayer = this.state.players.find(x => x.name === this.currentPlayer.name);
            if (this.detectChange(this.currentPlayer, updatedCurrentPlayer)) {
              this.currentPlayer = updatedCurrentPlayer;
            }
            this.updateTitle();
          } else {
            this.exitGame();
          }
        }
      );
    });
  }

  private updateTitle() {
    if (this.state) {
      if (this.state.status === false) {
        if (this.state.players.length > 1) {
          this.title = 'Partita in pausa';
          this.automaticModal = true;
        } else {
          this.title = 'In attesa...';
        }
      } else {
        const player = this.state.players.find(x => x.canMove === true);
        if (player) {
          if (this.currentPlayer.canMove) {
            this.title = 'E\' il tuo turno!';
          } else {
            this.title = `E' il turno di ${ player.name }`;
          }
        } else {
          this.title = 'Giro terminato';
          if (this.automaticModal) {
            this.automaticModal = false;
            setTimeout(() => {
              this.openPlayersModal();
            }, 1000);
          }
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
    if (this.playerModal) {
      this.playerModal.dismiss();
    }
    this.api.exitGroup(this.currentPlayer.name, this.state.code).subscribe(_ => {
      this.updateStateService.closeConnection();
      this.router.navigate(['/']);
    });
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

  sendMove(move: MoveModel) {
    this.updateStateService.sendMove(move.id);
  }

  detectChange(player1, player2) {
    player1.timestamp = undefined;
    player2.timestamp = undefined;
    return JSON.stringify(player1) !== JSON.stringify(player2);
  }

  async openTutorialModal() {
    const tutorialModal = await this.modalController.create({
      component: TutorialPage,
      componentProps: { type: 'CUCU_PAGE' }
    });
    tutorialModal.present();
  }
}
