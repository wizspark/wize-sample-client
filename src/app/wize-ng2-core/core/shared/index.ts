import { NgModule, ModuleWithProviders, APP_INITIALIZER} from '@angular/core';

import {
  CoreService,
  CoreHttpService,
  AppConfigService,
  UIConfigService,
  BootstrapService
} from './services';

import { WizeActivationGuard } from './guards';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { CommonModule } from '@angular/common';

export {
  CoreService,
  CoreHttpService,
  AppConfigService,
  UIConfigService,
  BootstrapService } from './services';

export {
  WizeCoreHttpHandler,
  WizeCoreAuthProvider
} from './interfaces';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SpinnerComponent
  ],
  providers: [
    BootstrapService,
    CoreService,
    AppConfigService,
    UIConfigService,
    WizeActivationGuard,
    CoreHttpService
  ]
})


export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        CoreHttpService,
        WizeActivationGuard,
        BootstrapService,
        AppConfigService,
        UIConfigService,
        SpinnerService,
        CoreService,
        {
          provide: APP_INITIALIZER,
          useFactory: BootstrapServiceFactory,
          deps: [
            BootstrapService,
            AppConfigService,
            UIConfigService
          ],
          multi: true
        }
      ]
    };
  }
}

export function BootstrapServiceFactory(bootstrapService: BootstrapService) {
  return () => bootstrapService.load();
}

