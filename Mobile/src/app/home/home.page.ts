import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CardSetModel, CardTypeEnum } from '../models/card-set.model';
import { ApiService } from '../services/api.service';
const { Storage } = Plugins;

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
    private api: ApiService) {
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
    this.goToGame();
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
    this.setStorage('nickname', this.nickname);
  }

  private async loadData(): Promise<any> {
    this.code = this.route.snapshot.paramMap.get('code');
    const nickname = await Storage.get({ key: 'nickname' });
    this.nickname = JSON.parse(nickname.value);
    this.getCardSets();
  }

  async setStorage(key: string, value: any): Promise<void> {
    await Storage.set({
      key,
      value: JSON.stringify(value)
    });
  }

  async getStorage(key: string): Promise<any> {
    const item = await Storage.get({ key });
    return JSON.parse(item.value);
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

}
