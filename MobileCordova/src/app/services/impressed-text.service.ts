import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ImpressedTextPage } from '../impressed-text/impressed-text.page';
import { ImpressedTextModel } from '../models/impressed-text.model';

@Injectable({
  providedIn: 'root'
})
export class ImpressedTextService {

  messages: ImpressedTextModel[] = [];
  messageListener = new BehaviorSubject<ImpressedTextModel[]>(this.messages);
  queue = -1;
  initialized = false;

  constructor(private modalController: ModalController) {
    this.enableMessages();
  }

  ionViewDidLeave() {
    this.disableMessages();
  }

  addImpressedText(text: string, from: string) {
    const message: ImpressedTextModel = new ImpressedTextModel();
    message.text = text;
    message.from = from;

    this.messages.push(message);
    this.messageListener.next(this.messages);
  }

  enableMessages() {
    if (!this.initialized) {
      this.initialized = true;
      this.messageListener.subscribe(async (messages) => {
        if (messages.length !== 0) {
          const message = this.messages.pop();
          this.messageListener.next(this.messages);
          await this.showImpressedText(message);
        }
      });
    }
  }

  disableMessages() {
    this.messageListener.unsubscribe();
    this.initialized = false;
  }

  async showImpressedText(message: ImpressedTextModel) {
    this.queue++;
    const delay = this.computeTime(message.text);
    setTimeout(async () => {
      const textModal = await this.modalController.create({
        component: ImpressedTextPage,
        componentProps: { msg: message },
        cssClass: 'imprressed-text-modal'
      });
      textModal.onDidDismiss().then(_ => { this.queue--; });
      await textModal.present().then(() => {
        setTimeout(() => {
          textModal.dismiss();
        }, delay);
      });
    }, delay * this.queue);
  }

  computeTime(text: string) {
    return Math.max(text.trim().split(' ').length * 500, 1500);
  }
}
