import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreComponent } from './components/core.component';
import { CoreRoutingModule } from './routing';
import { CommonModule } from '@angular/common';
import { WizeActivationGuard } from './shared/guards/index';
@NgModule({
  declarations: [
    CoreComponent
  ],
  imports: [
    CoreRoutingModule,
    CommonModule
  ],
  exports: [
  ],
  providers: [
    WizeActivationGuard
  ]
})

export class CoreModule {
  // static forRoot() {
  //   return {
  //     ngModule: CoreModule,
  //     providers: [
  //       WizeActivationGuard
  //     ]
  //   };
  // }

  constructor() {
    console.log('Core Module C\'tor');
  }
}
