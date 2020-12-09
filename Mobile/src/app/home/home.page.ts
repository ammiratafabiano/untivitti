import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { GameStateModel, PlayerModel } from '../models/game-state.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  code: string;
  nickname: string;
  selectedSet: CardTypeEnum = 0;

  currentPlayer: PlayerModel;

  cardSets: CardSetModel[];

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private utils: UtilsService) {
    this.loadData();
  }

  public join() {
    if (!this.code) {
      this.presentAlert('Please, insert a group code.');
      return;
    }
    if (!this.nickname) {
      this.presentAlert('Please, insert your nickname.');
      return;
    }
    this.retrieveGroup();
  }

  public create() {
    if (!this.nickname) {
      this.presentAlert('Please, insert your nickname.');
      return;
    }
    this.getCode();
  }

  private goToGame(currentPlayer: PlayerModel, group: GameStateModel) {
    this.saveData().then(_ => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            group: JSON.stringify(group),
            player: JSON.stringify(currentPlayer)
        },
        skipLocationChange: true
      };
      this.router.navigate(['/game'], navigationExtras);
    });
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Wait!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  private async saveData(): Promise<void> {
    this.utils.setStorage('nickname', this.nickname);
  }

  private async loadData(): Promise<any> {
    this.code = this.route.snapshot.paramMap.get('code');
    this.utils.getStorage('nickname').then((nickname) => {
      this.nickname = nickname;
    });
    this.getCardSets();
  }

  private getCardSets() {
    this.api.getCardSets().subscribe((response) => {
      if (response.success && response.data) {
        this.cardSets = response.data;
      }
    });
  }

  private getCode() {
    this.api.createGroup(this.nickname, this.selectedSet).subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data;
        const currentPlayer = response.data.players.find(x => x.name === this.nickname);
        this.goToGame(currentPlayer, group);
      } else {
        this.presentAlert('Sorry, something doesn\'t work, try later');
      }
    });
  }

  private retrieveGroup() {
    this.api.joinGroup(this.nickname, this.code).subscribe((response) => {
      if (response.success && response.data) {
        const group = response.data;
        const currentPlayer = response.data.players.find(x => x.name === this.nickname);
        this.goToGame(currentPlayer, group);
      } else {
        this.presentAlert('It seems this group doesn\'t exists. Check code and try again.');
      }
    });
  }

}
