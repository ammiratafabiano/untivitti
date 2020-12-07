import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
const { Storage } = Plugins;

export class CardSetModel {
  id: number;
  name: string;
  size: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  code: string;
  nickname: string;
  selectedSet = 0;

  cardSets: CardSetModel[];

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
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
    this.goToGame();
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
    this.cardSets = [
      {
        id: 0,
        name: 'Siciliane',
        size: 40
      }
    ];
  }

  private getCode() {
    const code = 'AGSHD';
    this.code = code;
  }

}
