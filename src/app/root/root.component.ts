import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { CoreHttpService, AppConfigService } from '../wize-ng2-core/core/shared/services/index';
import { HttpHandlerService } from './services/http.handler.service';
import { AuthService } from '../user/services/auth.service';
import { Title }  from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./root.component.scss']
})


export class RootComponent {

  constructor(private _httpService:CoreHttpService,
              private _httpErrorHandler:HttpHandlerService,
              private _auth:AuthService,
              private toastr:ToastsManager,
              private vcr:ViewContainerRef,
              private appConfigService:AppConfigService, private titleService:Title) {
    this.titleService.setTitle(this.appConfigService.getConfig('appTitle'));
    this.toastr.setRootViewContainerRef(vcr);
  }
}
