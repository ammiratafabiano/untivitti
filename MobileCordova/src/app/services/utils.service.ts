import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private storage: Storage) { }

  async setStorage(key: string, value: any): Promise<void> {
    await this.storage.set(key, value);
  }

  async getStorage(key: string): Promise<any> {
    return await this.storage.get(key);
  }
}
