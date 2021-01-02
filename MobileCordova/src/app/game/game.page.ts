import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, AnimationController, ModalController, PopoverController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CardSetModel } from '../models/card-set.model';
import { GameStateModel } from '../models/game-state.model';
import { GameModel } from '../models/game.model';
import { MoveModel, WarningMoveModel, WarningMoveTypeEnum } from '../models/move.model';
import { PlayerModel } from '../models/player.model';
import { PlayersPage } from '../players/players.page';
import { ApiService } from '../services/api.service';
import { StateUpdateService } from '../services/state-update.service';
import { UtilsService } from '../services/utils.service';
import { TutorialPage } from '../tutorial/tutorial.page';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  @ViewChild('card') card: ElementRef;
  @ViewChild('ground') ground: ElementRef;

  loop: any;

  currentPlayer: PlayerModel;
  currentGame: GameModel;
  currentCardSet: CardSetModel;
  state: GameStateModel;
  stateListener: BehaviorSubject<GameStateModel>;

  title: string;

  playerModal: any;
  automaticModal = true;

  allPaid = true;

  tempCard: number;
  tempGround: number;

  moving: boolean;

  playersBoard: PlayerModel[];

  fireworks = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private updateStateService: StateUpdateService,
    private api: ApiService,
    private animationCtrl: AnimationController,
    private utils: UtilsService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.group && params.player) {
        this.state = JSON.parse(params.group);
        this.stateListener = new BehaviorSubject<GameStateModel>(this.state);
        this.currentPlayer = JSON.parse(params.player);
        this.currentGame = JSON.parse(params.game);
        this.currentCardSet = JSON.parse(params.cardSet);
      } else {
        this.exitGame();
      }
      this.updateStateService.initConnection(this.state, this.currentPlayer)
      .subscribe(response => {
          if (response) {
            this.state = response;
            this.stateListener.next(this.state);
            const updatedCurrentPlayer = this.state.players.find(x => x.name === this.currentPlayer.name);
            if (this.detectChange([this.currentPlayer], [updatedCurrentPlayer])) {
              this.currentPlayer = updatedCurrentPlayer;
            }
            this.updateTitle();
            if (this.state.money) {
              this.checkPayments();
            }
            if (this.card && this.ground) {
              this.checkSwapBack();
            }
            this.setBoardPlayers();
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
        this.tempCard = undefined;
        this.tempGround = undefined;
        const winner = this.isGameOver();
        if (winner) {
          this.title = `${ winner.name } ha vinto!`;
          this.automaticModal = true;
          if (!this.fireworks) {
            this.closePlayersModal();
          }
          this.fireworks = true;
        } else if (this.state.players.length > 1) {
          this.title = 'Partita in pausa';
          this.automaticModal = true;
        } else {
          this.title = 'In attesa...';
        }
      } else {
        this.fireworks = false;
        const player = this.isNotTurnOver();
        if (player) {
          if (this.currentPlayer.canMove) {
            if (this.currentGame.teams) {
              this.title = 'E\' il vostro turno!';
            } else {
              this.title = 'E\' il tuo turno!';
            }
          } else {
            if (this.currentGame.teams) {
              if (player.team === 0) {
              this.title = 'Tocca al Banco';
              } else {
                this.title = 'Tocca alle squadre';
              }
            } else {
              this.title = `Tocca a ${ player.name }`;
            }
          }
        } else {
          this.title = 'Giro terminato';
          if (this.automaticModal) {
            this.automaticModal = false;
            setTimeout(() => {
              this.openPlayersModal();
            }, this.currentPlayer.isAdmin ? 2000 : 1000);
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
    this.closePlayersModal();
    this.updateStateService.closeConnection();
    this.utils.setStorage('uuid', undefined);
    this.api.exitGroup(this.currentPlayer.name, this.state.code).subscribe(_ => {});
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    if (this.state) {
      return this.state.players.find(x => x.name === this.currentPlayer.name).isAdmin;
    }
  }

  async openPlayersModal() {
    if (!this.playerModal) {
      this.playerModal = await this.modalController.create({
        component: PlayersPage,
        componentProps: {
          state: this.stateListener,
          nickname: this.currentPlayer.name,
          cardSet: this.currentCardSet,
          game: this.currentGame
        }
      });
      this.playerModal.onDidDismiss().then(() => { this.playerModal = undefined; });
      await this.playerModal.present();
    }
  }

  closePlayersModal() {
    if (this.playerModal) {
      this.playerModal.dismiss();
    }
  }

  detectChange(list1, list2) {
    if (list1 && list2) {
      list1.forEach(x => {
        if (x) {
          x.timestamp = undefined;
        } else {
          return true;
        }
      });
      list2.forEach(x => {
        if (x) {
          x.timestamp = undefined;
        } else {
          return true;
        }
      });
      return JSON.stringify(list1) !== JSON.stringify(list2);
    } else {
      return true;
    }
  }

  async openTutorialModal() {
    const tutorialModal = await this.modalController.create({
      component: TutorialPage,
      componentProps: { type: 'GAME_PAGE', game: this.currentGame.id }
    });
    tutorialModal.present();
  }

  checkPayments() {
    if (this.state.players.findIndex(x => x.haveToPay === true) !== -1) {
      this.allPaid = false;
    } else {
      this.allPaid = true;
    }
  }

  sendMove(move: MoveModel) {
    if (move.id === 5) {
      this.moving = true;
      this.swapAnimationStart().onFinish(() => {
        this.updateStateService.sendMove(5);
      }).play();
    } else {
      this.updateStateService.sendMove(move.id);
    }
  }

  swapAnimationStart() {
    if (this.currentPlayer.isAdmin) {
      return this.animationCtrl.create()
      .addElement(this.card.nativeElement)
      .duration(200)
      .fromTo('transform', 'translateX(0)', 'translateX(-20%)');
    } else {
      return this.animationCtrl.create()
      .addElement(this.card.nativeElement)
      .duration(400)
      .fromTo('transform', 'translateX(0) translateY(0) rotate(0)', 'translateX(100%) translateY(-50%) rotate(30deg)');
    }
  }

  swapAnimationEnd() {
    if (this.currentPlayer.isAdmin) {
      return this.animationCtrl.create()
      .addElement(this.ground.nativeElement)
      .duration(400)
      .fromTo('transform', 'translateX(100%) translateY(-100%) rotateY(180deg)', 'translateX(20%) translateY(-100%) rotateY(0)');
    } else {
      return this.animationCtrl.create()
      .addElement(this.card.nativeElement)
      .duration(400)
      .fromTo('transform', 'translateX(100%) translateY(-50%) rotate(30deg)', 'translateX(0) translateY(0) rotate(0)');
    }
  }

  startAnimation() {
    return this.animationCtrl.create()
    .addElement(this.card.nativeElement)
    .duration(400)
    .fromTo('transform', 'translateX(-100%) translateY(-50%) rotate(-30deg)', 'translateX(0) translateY(0) rotate(0)');
  }

  stopAnimation() {
    return this.animationCtrl.create()
    .addElement(this.card.nativeElement)
    .duration(400)
    .fromTo('transform', 'translateX(0) translateY(0) rotate(0)', 'translateX(-100%) translateY(-50%) rotate(-30deg)');
  }

  showNextAnimation() {
    this.animationCtrl.create()
    .addElement(this.ground.nativeElement)
    .duration(1000)
    .fromTo('transform', 'translateX(100%) translateY(-100%)', 'translateX(20%) translateY(-100%)')
    .onFinish(() => {
      this.animationCtrl.create()
      .addElement(this.ground.nativeElement)
      .duration(1000)
      .fromTo('transform', 'translateX(20%) translateY(-100%)', 'translateX(100%) translateY(-100%)')
      .onFinish(() => {
        this.tempGround = undefined;
      }).play();
    }).play();
  }

  checkSwapBack() {
    if (this.tempCard === undefined && this.currentPlayer.cards.length > 0) {
      this.tempCard = this.currentPlayer.cards[0];
      this.startAnimation().play();
    } else if (this.tempCard !== undefined && this.currentPlayer.cards.length > 0 && this.tempCard !== this.currentPlayer.cards[0]) {
      if (!this.moving) {
        this.stopAnimation().onFinish(() => {
          this.tempCard = this.currentPlayer.cards[0];
          setTimeout(() => {
            this.startAnimation().play();
          }, 500);
        }).play();
      } else {
        this.tempCard = this.currentPlayer.cards[0];
        this.swapAnimationEnd().onFinish(() => {
          this.moving = false;
        }).play();
      }
    } else if (this.currentPlayer.isAdmin && this.state.ground.length > 0 && this.moving) {
      this.tempGround = this.state.ground[0];
      this.swapAnimationEnd().onFinish(() => {
        this.moving = false;
      }).play();
    } else if (!this.currentPlayer.isAdmin && this.currentPlayer.cards.length > 0
      && this.currentPlayer.lastMove === 5 && this.tempCard === this.currentPlayer.cards[0] && this.moving) {
      this.moving = false;
      this.tempGround = this.getNextCard();
      if (this.tempGround) {
        this.swapAnimationEnd().onFinish(() => {
          this.showNextAnimation();
        }).play();
      }
    }
  }

  setBoardPlayers() {
    const list: PlayerModel[] = [];
    const activePlayers = this.state.players.filter(x => !x.ghost);
    const index = activePlayers.findIndex(x => x.canMove === true);
    if (index !== -1) {
      const prev = activePlayers[(index - 1 + activePlayers.length) % activePlayers.length];
      prev.isAdmin ? list.push(undefined) : list.push(prev);
      const current = activePlayers[index % activePlayers.length];
      list.push(current);
      const next = activePlayers[(index + 1 + activePlayers.length) % activePlayers.length];
      current.isAdmin ? list.push(undefined) : list.push(next);
      if (this.detectChange(this.playersBoard, list)) {
        this.playersBoard = list;
      }
    } else if (activePlayers && this.playersBoard) {
      if (this.state.status) {
        activePlayers.forEach(x => {
          this.playersBoard.forEach(y => {
            if (x && y && x.name === y.name && x.lastMove !== y.lastMove) {
              y.lastMove = x.lastMove;
            }
          });
        });
      } else {
        this.playersBoard = [];
      }
    }
  }

  async openChat() {
    const alert = await this.alertController.create({
      header: 'Invia un messaggio',
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
          text: 'Invia',
          handler: (out) => {
            this.updateStateService.sendText(out.value, this.currentPlayer);
          }
        }
      ]
    });

    await alert.present();
  }

  getNextCard() {
    let card;
    const index = this.state.players.findIndex(x => x.name === this.currentPlayer.name);
    let attempt = 0;
    do {
      attempt += 1;
      card = this.state.players[(index + 1) % this.state.players.length].cards[0];
    } while (!card && attempt < this.state.players.length);
    return card;
  }

  async confirmMove(move: MoveModel) {
    let warningToShow: WarningMoveModel;
    for (const warning of  move.warnings) {
      if (warningToShow) {
        break;
      }
      switch (warning.type) {
        case WarningMoveTypeEnum.NotFinished:
          if (this.isNotTurnOver()) {
            warningToShow = warning;
            break;
          }
      }
    }

    if (warningToShow) {
      const alert = await this.alertController.create({
        header: 'Attenzione',
        message: warningToShow.description,
        buttons: [
          {
            text: 'Annulla',
            role: 'cancel'
          },
          {
            text: move.name,
            handler: () => {
              this.sendMove(move);
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.sendMove(move);
    }
  }

  isGameOver() {
    return this.state.players.find(x => x.isWinner);
  }

  isNotTurnOver() {
    return this.state.players.find(x => x.canMove);
  }
}
