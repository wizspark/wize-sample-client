import { Component } from '@angular/core';
@Component({
  template: `<router-outlet></router-outlet>`
})


export class CoreComponent {
  constructor()  {
    console.log('Core Component C\'tor');
  }
}
