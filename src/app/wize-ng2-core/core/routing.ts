import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './components/core.component';
import { WizeActivationGuard } from './shared/guards/wize.activation.guard';
//, canActivate: [WizeActivationGuard],
//    canActivateChild: [WizeActivationGuard],
@NgModule({
  imports: [
    RouterModule.forChild([
        {
          path: '', component: CoreComponent,
          children: [
            {
              path: 'page', loadChildren: '../features/index#WizeDataTableModule',
            },
            {
              path: 'admin', loadChildren: '../features/index#AdminModule'
            }

          ]
        }
      ]
    )
  ],
  exports: [
    RouterModule
  ]
})
export class CoreRoutingModule {
}
