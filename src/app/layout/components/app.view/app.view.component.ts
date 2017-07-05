import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AppConfigService } from '../../../wize-ng2-core/core/shared/services/index';
@Component({
  selector: 'app-view',
  templateUrl: './app.view.html',
  styleUrls: ['./app.view.css']
})

export class AppViewComponent implements OnInit{
  constructor(private router: Router,
              private appConfigService: AppConfigService) {

  }

  ngOnInit() {
    if(this.router.url === '/' || this.router.url === '') {
      this.router.navigate([this.appConfigService.getConfig('defaultRoute')]);
    }
  }
}
