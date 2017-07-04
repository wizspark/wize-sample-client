import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {
  MainComponent
} from './components';

import { SecurityRoutingModule } from './routing';
export { securityRoutes } from './routing';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SecurityRoutingModule
  ],
  exports: [
    MainComponent
  ],
  providers: []
})

export class SecurityModule {
  constructor() {
    //console.log('Security Module C\'tor');
  }
}

