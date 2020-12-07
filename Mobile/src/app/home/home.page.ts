import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

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

  constructor(public alertController: AlertController) {
    this.getCardSets();
  }

  private join() {
    if (!this.code) {
      this.presentAlert('Please, insert a group code.');
      return;
    }
    if (!this.nickname) {
      this.presentAlert('Please, insert your nickname.');
      return;
    }
  }

  private create() {
    if (!this.nickname) {
      this.presentAlert('Please, insert your nickname.');
      return;
    }
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

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Wait!',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

}
