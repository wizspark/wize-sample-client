import { Injectable } from '@angular/core';

@Injectable()
export class FilterTextService {

  public filter(data: string, props: string[], originalList: any[]) {
    let filteredList: any[];

    if (data && props && originalList) {
      data = data.toLowerCase();
      filteredList = originalList.filter((item) => {
        let match = false;
        for (let prop of props) {
          if (item[prop] && item[prop].toString().toLowerCase().indexOf(data) > -1) {
            match = true;
            break;
          }
        }
        return match;
      });
    } else {
      filteredList = originalList;
    }

    return filteredList;
  }
}
