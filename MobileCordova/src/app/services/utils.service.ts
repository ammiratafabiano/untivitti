import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private storage: Storage) { }

  setStorage(key: string, value: any) {
    this.storage.set(key, value);
    window.localStorage.setItem(key, value);
  }

  getStorage(key: string): Promise<any> {
    window.localStorage.getItem(key);
    return this.storage.get(key);
  }
}
