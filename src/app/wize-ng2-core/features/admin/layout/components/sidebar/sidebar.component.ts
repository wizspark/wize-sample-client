import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UIConfigService } from '../../../../../core/shared/services/index';
import { AuthService } from '../../../../../../user/services/auth.service';

@Component({
  selector: 'sidebar-layout',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() private eventEmitter = new EventEmitter();
  private toggle: boolean = false;
  private isAudits: boolean = false;
  constructor(private uiConfigService:UIConfigService, private authService: AuthService){

  }
  onToggle() {
    this.toggle = !this.toggle;
    this.eventEmitter.emit(this.toggle);
  }

  ngOnInit(){
    const module = this.uiConfigService.getModule('@wizeapps/sequelize-audit');
    if(module) {
      this.isAudits = true;
    }
  }

  get user() {
    return this.authService.user;
  }
}
