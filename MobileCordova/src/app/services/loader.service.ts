import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading = false;
  constructor(
    public loadingController: LoadingController
  )
  { }

  async show() {
    this.isLoading = true;
    return await this.loadingController.create().then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
}
