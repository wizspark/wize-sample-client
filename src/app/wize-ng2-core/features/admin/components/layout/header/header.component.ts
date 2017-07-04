import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
  selector: 'wize-admin-header',
  templateUrl: 'header.html'
})

export class HeaderComponent implements OnInit{
  private items: MenuItem[];
  constructor() {
  }
  ngOnInit() {
    const icon = 'fa-star';
    this.items = [
      // {
      //   label: 'Settings',
      //   routerLink: '/wize/admin/settings',
      //   icon: icon
      // },
      // {
      //   label: 'Audit Trail',
      //   icon: icon,
      //   routerLink: '/wize/admin/audits'
      // },
      {
        label: 'User Interface',
        icon: icon,
        routerLink: '/wize/admin/ui-configration'
      },
      // {
      //   label: 'Reports',
      //   icon: icon,
      //   routerLink: '/wize/admin/reports'
      // },
      {
        label: 'Scheduling',
        icon: icon,
        routerLink: '/wize/admin/scheduler'
      },
      {
        label: 'Entity Modeling',
        icon: icon,
        routerLink: '/wize/admin/model-schema'
      },
      {
        label: 'Security',
        icon: icon,
        routerLink: '/wize/admin/security',
        items: [
          {
            label: 'Users',
            icon: icon,
          },
          {
            label: 'Groups',
            icon: icon,
          },
          {
            label: 'Roles',
            icon: icon,
          }
        ]
      }
    ];
  }
}
