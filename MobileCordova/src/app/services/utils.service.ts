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

  getViewport() {

    let viewPortWidth;
    let viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth !== 'undefined') {
      viewPortWidth = window.innerWidth,
      viewPortHeight = window.innerHeight;
    }

   // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement !== 'undefined'
    && typeof document.documentElement.clientWidth !==
    'undefined' && document.documentElement.clientWidth !== 0) {
       viewPortWidth = document.documentElement.clientWidth,
       viewPortHeight = document.documentElement.clientHeight;
    }

    // older versions of IE
    else {
      viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
      viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewPortWidth, viewPortHeight];
  }
}
