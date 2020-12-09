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
    const toast = await this.toastController.create({
      message: notification.message,
      duration: 2000
    });
    toast.present();
  }
  
}
