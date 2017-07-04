import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UIConfigService } from '../../../../../core/shared/services/index';
@Component({
  selector: 'sidebar-layout',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() private eventEmitter = new EventEmitter();
  private toggle: boolean = false;
  private isAudits: boolean = false;
  constructor(private uiConfigService:UIConfigService){

  }
  onToggle() {
    this.toggle = !this.toggle;
    this.eventEmitter.emit(this.toggle);
  }

  ngOnInit(){
    let routes = this.uiConfigService.getRoutes();
    if(routes.find((p) => p.url === '/audit')){
      this.isAudits = true;
    }
  }
}
