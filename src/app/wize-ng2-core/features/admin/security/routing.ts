import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components';
//
//
export const securityRoutes: Routes = [
  { path: 'security', component: MainComponent }
];


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'admin/security', component: MainComponent }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SecurityRoutingModule {
}
