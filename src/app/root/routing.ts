import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { authRoutes } from '../user/user-routing.module';

@NgModule({
  imports: [
    RouterModule.forRoot([
      ...authRoutes
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RootRoutingModule {
}
