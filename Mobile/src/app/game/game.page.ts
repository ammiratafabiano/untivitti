import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStateModel } from '../models/game-state.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  loop: any;

  nickname: string;
  code: string;
  state: GameStateModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService) {
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
    if (this.code) {
      this.loop = setInterval(_ => {
        return this.api.getState(this.code).subscribe((state) => {
          this.state = state;
        });
      }, 1000);
    }
  }

  ionViewWillLeave() {
    clearInterval(this.loop);
  }

  exitGame() {
    clearInterval(this.loop);
    this.router.navigate(['/']);
  }

}
