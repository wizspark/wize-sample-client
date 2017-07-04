import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppViewComponent, NavBarComponent } from './components/index';
import { LayoutRoutingModule } from './routing';
import { SharedModule } from 'primeng/primeng';
import { NoViewComponent } from './components/404/no.view.component';
import { Menu, MenubarModule, Menubar} from 'primeng/primeng';
import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { MenuBarComponent } from '../wize-ng2-core/index';
import { ReportsModule } from '../reports/index';

@NgModule({
  declarations: [ NavBarComponent, AppViewComponent , NoViewComponent, MenuBarComponent],
  imports: [
    LayoutRoutingModule,
    SharedModule,
    TabMenuModule,
    CommonModule,
    MenubarModule,
    ReportsModule
  ],
  providers: [],
  exports: [ AppViewComponent, NoViewComponent ]
})

export class LayoutModule {
}
