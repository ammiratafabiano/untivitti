import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  setStorage(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }

  getStorage(key: string) {
    return window.localStorage.getItem(key);
  }
}
