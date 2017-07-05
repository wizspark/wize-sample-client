import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent, ReportBuilderComponent } from './components/index';

export const reportsRoutes: Routes = [
  //{ path: '', redirectTo: 'reports', pathMatch: 'full' },
  { path: 'reports', component: ReportListComponent }
];



@NgModule({
  imports: [
    RouterModule.forChild(
      reportsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ReportRoutingModule {
}
