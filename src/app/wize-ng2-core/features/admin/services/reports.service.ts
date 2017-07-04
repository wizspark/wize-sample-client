import {Injectable} from "@angular/core";

@Injectable()
export class DynamicHeight {

  constructor(){}

  scrollHeight(offset: number){
    return window.innerHeight-(offset || 0);
  }

}
