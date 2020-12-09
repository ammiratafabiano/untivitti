import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GameStateModel, PlayerModel } from '../models/game-state.model';
import { ApiService } from '../services/api.service';

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
    private api: ApiService) {
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
    this.reordering = false;
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

}
