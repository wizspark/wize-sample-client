import { Component, OnInit } from '@angular/core';
import { SlideMenuModule, MenuItem } from 'primeng/primeng';
import {Input,EventEmitter,ViewChild,trigger,state,transition,style,animate,Inject,forwardRef} from '@angular/core';
@Component({
  selector: 'wize-admin-layout',
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})

export class LayoutComponent implements OnInit{
  private items: MenuItem[];
  ngOnInit() {
    this.items = [
      {
        label: 'File',
        items: [{
          label: 'New',
          icon: 'fa-plus',
          items: [
            {label: 'Project'},
            {label: 'Other'},
          ]
        },
          {label: 'Open'},
          {label: 'Quit'}
        ]
      },
      {
        label: 'Edit',
        icon: 'fa-edit',
        items: [
          {label: 'Undo', icon: 'fa-mail-forward'},
          {label: 'Redo', icon: 'fa-mail-reply'}
        ]
      }
    ];
  }
}
