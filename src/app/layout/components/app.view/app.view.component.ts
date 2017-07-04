import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './app.view.html',
  styleUrls: ['./app.view.css']
})

export class AppViewComponent {
  constructor(private router: Router) {

  }
  navigate() {
    console.log('Navigating to dataview/pages');
    this.router.navigate(['/dataview/page']);
  }
}
