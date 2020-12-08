import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { GameStateModel, PlayerModel } from '../models/game-state.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  players: PlayerModel[];

  constructor(
    public modalController: ModalController,
    public navParams: NavParams) {
    this.players = this.navParams.get('state').players;
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

  reorderPlayers(ev: any) {
    const itemMove = this.players.splice(ev.detail.from, 1)[0];
    this.players.splice(ev.detail.to, 0, itemMove);
    ev.detail.complete();
  }

}
