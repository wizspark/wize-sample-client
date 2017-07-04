import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataViewComponent } from './components/root/core.view.component';
import { RowDetailComponent } from '../row-detail/row-detail';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'page', component: DataViewComponent },
      { path: '', component: DataViewComponent },
      { path: ':route', component: DataViewComponent },
      { path: ':route/:id', component: RowDetailComponent}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class DataRoutingModule {
}
