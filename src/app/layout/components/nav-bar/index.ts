import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { UIConfigService } from '../../../wize-ng2-core/core/shared';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.html',
  styleUrls: [ 'nav-bar.scss' ],
})

export class NavBarComponent implements OnInit {
  pages: any[] ;
  items: MenuItem[];

  constructor(private uiConfigService: UIConfigService) {
    this.pages = [{
      label: 'Navigation To Page'
    }];
  }

  ngOnInit() {
    // this.items = [
    //   {label: 'Employees', routerLink: ['/data/page/']}
    // ];
    const menuItems: MenuItem [] = [];
    this.uiConfigService.getRoutes().forEach((route) => {

      if (route.entities) {
        menuItems.push({
          routerLink: [`/page/${route.route}`],
          label: route.title
        });
      } else {
        menuItems.push({
          routerLink: [`/${route.route}`],
          label: route.title
        });
      }
      // menuItems.push({
      //   routerLink: [`/page/${route.route}`],
      //   label: route.title
      // });
    });
    this.items = menuItems;
  }
}
