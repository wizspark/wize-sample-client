import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { CoreHttpService } from '../wize-ng2-core/core/shared/services/core.http.service';
import { HttpHandlerService } from './services/http.handler.service';
import { AuthService } from '../user/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./root.component.scss']
})


export class RootComponent {
  title = 'Root Component (Routing...)';

  constructor(private _httpService: CoreHttpService,
              private _httpErrorHandler: HttpHandlerService,
              private _auth: AuthService,
              private toastr: ToastsManager, private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }
}
