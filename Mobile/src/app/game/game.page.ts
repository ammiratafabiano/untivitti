import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export enum CardTypeEnum {
  Siciliane = 0
}

export class PlayerModel {
  name: string;
  isAdmin: boolean;
}

export class GameStateModel {
  code: string;
  type: CardTypeEnum;
  players: PlayerModel[];
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  nickname: string;
  code: string;
  state: GameStateModel;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.code && params.nickname) {
        this.code = params.code;
        this.nickname = params.nickname;
      } else {
        this.exitGame();
      }
    });
  }

  ngOnInit() {
    const loop = setInterval(_ => {
      this.updateState();

    }, 1000);
    clearInterval(loop);
  }

  updateState() {
  }

  exitGame() {
    this.router.navigate(['/']);
  }

}
