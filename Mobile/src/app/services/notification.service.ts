import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notifications: NotificationModel[] = [];
  notificationListener = new BehaviorSubject<NotificationModel[]>(this.notifications);
  queue: number = -1;
  notificationTime = 2000;

  constructor(private toastController: ToastController) { }

  addNotification(notification: NotificationModel) {
    this.notifications.push(notification);
    this.notificationListener.next(this.notifications);
  }

  handleNotifications() {
    this.notificationListener.subscribe(async (notifications) => {
      if (notifications.length != 0) {
        const notification = this.notifications.pop();
        this.notificationListener.next(this.notifications);
        await this.showNotification(notification);
      }
    });
  }

  async showNotification(notification: NotificationModel) {
    this.queue++;
    setTimeout(async() => {
      const toast = await this.toastController.create({
        message: notification.message,
        duration: this.notificationTime
      });
      toast.onDidDismiss().then(_ => { this.queue-- });
      toast.present();
    }, this.notificationTime * this.queue);
  }
  
}
