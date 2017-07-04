import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { AppViewComponent, NoViewComponent } from './components/index';
import { reportsRoutes } from '../reports/routing';
import { AuthGuard } from '../user/guards/auth.gaurd';
import { UserRolesResolve } from '../user/resolves/user-roles.resolve';
export const wizeCoreRoutes: Routes = [
  {path: 'wize', loadChildren: '../wize-ng2-core/core/index#CoreModule'}
];

@NgModule({
  imports: [
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: AppViewComponent,
        canActivate: [AuthGuard, UserRolesResolve],
        children: [
          ...wizeCoreRoutes,
          ...reportsRoutes,
          {path: '**', component: NoViewComponent}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class LayoutRoutingModule {}
