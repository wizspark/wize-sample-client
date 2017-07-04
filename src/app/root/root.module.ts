import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'ng2-toastr';

import { RootComponent } from './root.component';
import { RootRoutingModule } from './routing';
import { LayoutModule } from '../layout/index';
import { APP_RESOLVER_PROVIDERS } from './resolver/core.resolver';
import { SharedModule } from '../wize-ng2-core/core/shared/index';
import { HttpHandlerService } from './services/http.handler.service';
import { UserModule } from '../user/index';
import { CoreToastManager } from './services/core-toast-manager';

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS
];

@NgModule({
  declarations: [
    RootComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RootRoutingModule,
    LayoutModule,
    SharedModule.forRoot(),
    UserModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    HttpHandlerService,
    APP_PROVIDERS,
    CoreToastManager
  ],
  bootstrap: [RootComponent]
})
export class RootModule {
}
