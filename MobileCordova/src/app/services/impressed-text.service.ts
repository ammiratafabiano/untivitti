import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImpressedTextPage } from '../impressed-text/impressed-text.page';

@Injectable({
  providedIn: 'root'
})
export class ImpressedTextService {

  private textModal: any;

  constructor(private modalController: ModalController) {}

  async openTextModal(text: string, from: boolean) {
    if (!this.textModal) {
      this.textModal = await this.modalController.create({
        component: ImpressedTextPage,
        componentProps: { msg: { text, from } },
        cssClass: 'imprressed-text-modal'
      });
      this.textModal.onDidDismiss().then(() => { this.textModal = undefined; });
      await this.textModal.present().then(() => {
        setTimeout(() => {
          this.textModal.dismiss();
        }, this.computeTime(text));
      });
    }
  }

  computeTime(text: string) {
    return Math.max(text.trim().split(' ').length * 500, 1500);
  }
}
