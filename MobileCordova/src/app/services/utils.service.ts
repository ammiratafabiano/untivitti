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
    const valueToRet = window.localStorage.getItem(key);
    if (valueToRet !== 'undefined' && valueToRet !== undefined && valueToRet !== '') {
      return valueToRet;
    } else {
      return undefined;
    }
  }
}
