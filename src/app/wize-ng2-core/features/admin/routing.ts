import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/index';
import { securityRoutes } from './security/index';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'security', pathMatch: 'full' },
      {
        path: '', component: AdminComponent,
        children: [
          ...securityRoutes,
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {
}
