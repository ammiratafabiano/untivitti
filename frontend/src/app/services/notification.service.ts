import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NotificationIcons, NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notifications: NotificationModel[] = [];
  notificationListener = new BehaviorSubject<NotificationModel[]>(this.notifications);
  queue = -1;
  initialized = false;

  constructor(private toastController: ToastController) {
    this.enableNotifications();
  }

  ionViewDidLeave() {
    this.disableNotifications();
  }

  addNotification(message, icon?, time?, disableButton?) {
    const notification: NotificationModel = new NotificationModel();
    notification.message = message;
    notification.icon = icon !== undefined ? icon : notification.icon;
    notification.time = time !== undefined ? time : notification.time;
    notification.disableButton = disableButton !== undefined ? disableButton : notification.disableButton;

    this.notifications.push(notification);
    this.notificationListener.next(this.notifications);
  }

  enableNotifications() {
    if (!this.initialized) {
      this.initialized = true;
      this.notificationListener.subscribe(async (notifications) => {
        if (notifications.length !== 0) {
          const notification = this.notifications.pop();
          this.notificationListener.next(this.notifications);
          await this.showNotification(notification);
        }
      });
    }
  }

  disableNotifications() {
    this.notificationListener.unsubscribe();
    this.initialized = false;
  }

  async showNotification(notification: NotificationModel) {
    this.queue++;
    setTimeout(async () => {
      const buttons = [];
      if (notification.icon) {
        buttons.push({
          side: 'start',
          icon: notification.icon,
          handler: () => {}
        });
      }
      if (!notification.disableButton) {
        buttons.push({
          side: 'end',
          icon: NotificationIcons.Close,
          handler: () => {}
        });
      }
      const toast = await this.toastController.create({
        message: notification.message,
        duration: notification.time,
        buttons
      });
      toast.onDidDismiss().then(_ => { this.queue--; });
      toast.present();
    }, notification.time * this.queue);
  }

}
