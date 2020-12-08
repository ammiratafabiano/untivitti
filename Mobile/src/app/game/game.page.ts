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

  title: string;

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
        this.updateTitle();
        this.updateState();
      }, 1000);
    }
  }

  ionViewWillLeave() {
    clearInterval(this.loop);
  }

  private updateState() {
    return this.api.getState(this.code).subscribe(
      response => {
        if (response.success && response.data) {
          this.state = response.data;
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
      if (this.state.players && this.state.players.length > 1) {
        if (this.isAdmin()) {
          this.title = 'Group ready to start';
        } else {
          this.title = 'Waiting for admin to start';
        }
      } else {
        this.title = 'Waiting for people...';
      }
    } else {
      this.title = 'Waiting for people...';
    }
  }

  private exitGame() {
    clearInterval(this.loop);
    this.router.navigate(['/']);
  }

  private isAdmin(): boolean {
    if (this.state) {
      return this.state.players.find(x => x.name === this.nickname).isAdmin;
    }
  }

}
