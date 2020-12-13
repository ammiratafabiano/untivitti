import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private nativeStorage: NativeStorage) { }

  setStorage(key: string, value: any) {
    this.nativeStorage.setItem(key, value);
  }

  getStorage(key: string): Promise<any> {
    return this.nativeStorage.getItem(key);
  }
}
