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

  detectChange(list1, list2) {
    if (list1 && list2) {
      const copyList1 = Array.isArray(list1) ? [...list1] : Object.assign(list1);
      const copyList2 = Array.isArray(list2) ? [...list2] : Object.assign(list2);
      this.setProperty(copyList1, 'timestamp', undefined);
      this.setProperty(copyList2, 'timestamp', undefined);
      return JSON.stringify(copyList1) !== JSON.stringify(copyList2);
    } else {
      return true;
    }
  }

  setProperty(o, id, value) {
    if (o) {
      if (o[id] !== undefined) {
        o[id] = value;
      }
      let p;
      for (p in o) {
        if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
          this.setProperty(o[p], id, value);
        } else if (o.hasOwnProperty(p) && Array.isArray(o[p])) {
          o[p].array.forEach(el => {
            this.setProperty(el, id, value);
          });
        }
      }
    }
  }
}
