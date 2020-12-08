import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  code: string;
  nickname: string;
  selectedSet: CardTypeEnum = 0;

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

  private goToGame() {
    this.saveData().then(_ => {
      const navigationExtras: NavigationExtras = {
        queryParams: {
            code: this.code,
            nickname: this.nickname
        }
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
        this.code = response.data;
        this.goToGame();
      }
    });
  }

  private retrieveGroup() {
    this.api.joinGroup(this.nickname, this.code).subscribe((response) => {
      if (response.success) {
        this.goToGame();
      } else {
        this.presentAlert('It seems this group doesn\'t exists. Check code and try again.');
      }
    });
  }

}
