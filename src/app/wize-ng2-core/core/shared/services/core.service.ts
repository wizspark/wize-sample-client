import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BootstrapService } from './bootstrap.service';

@Injectable()
export class CoreService {
  sharedProp = 0 ;
  routerLinks: any[] = [] ;

  constructor(private _bootstrapService: BootstrapService) {
    console.log('Comm Service C\'tor');
  }
  increment() {
    this.sharedProp++;
  }
  decrement() {
    this.sharedProp--;
  }
  print() {
    console.log(this.sharedProp);
  }
}
