import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule, DataTableModule, TabViewModule } from 'primeng/primeng';

import { DataViewComponent } from './components/root/core.view.component';
import { BasicDTComponent } from './components/basic/datatable.component';
import { BasicDataTableComponent } from './components/dt-basic/dt-basic.component';
import { DetailDataTableComponent } from './components/dt-detail/dt-detail.component';
import { GroupDataTableComponent } from './components/dt-group/dt-group.component';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { RowDetailComponent } from '../row-detail/row-detail';
import { FilterComponent } from './components/filter/filter.component';
import { FilterItemComponent } from './components/filter/filter-item/filter-item.component';
import { HeaderComponent } from './components/dt-header/header.component';

import { AddComponent } from './components/dt-header/dt-add/add.component';
import { ColumnSelectorComponent } from './components/dt-header/dt-column-selector/column-selector.component';
import { ImportExportComponent } from './components/dt-header/dt-import-export/import-export.component';
import { SearchComponent } from './components/dt-header/dt-search/search.component';
import { ImportDataComponent } from './components/import-data/import-data.component';
import { HeaderFilterComponent } from './components/dt-header/dt-filter/filter.component';

import { RelationshipComponent } from '../row-detail/relationship/relationship.component';
import { ViewDetailComponent } from './components/view-details/view-details.component'
import { DataTableService } from './services/datatable.service';
import { PluralService } from '../../../../wize-ng2-core/core/shared/services/pluralize.service';

import { DataRoutingModule } from './routing';
import { ModalModule } from '../../modal/index';
import { CustomFormModule } from '../../form-builder/index';
import { CodeEditorModule } from "../../../../editor/index";


import { ArrayFilterPipe } from './pipes/array-filter.pipe';
import { EllipsisPipe } from './pipes/ellipses.pipe';
import { RuleBuilderModule } from '../../rule-builder/index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    DataRoutingModule,
    ModalModule,
    CustomFormModule,
    TabViewModule,
    CodeEditorModule,
    RuleBuilderModule
  ],
  exports: [
    BasicDataTableComponent,
    DetailDataTableComponent,
    GroupDataTableComponent,
    HeaderComponent,
    SearchComponent,
    ImportExportComponent,
    ColumnSelectorComponent,
    BasicDTComponent,
    AddComponent,
    AddEditComponent,
    ImportDataComponent,
    HeaderFilterComponent,
    FilterComponent,
    RelationshipComponent,
    FilterItemComponent,
    DataViewComponent,
    ViewDetailComponent
  ],
  declarations: [
    BasicDataTableComponent,
    DetailDataTableComponent,
    GroupDataTableComponent,
    HeaderComponent,
    SearchComponent,
    ImportExportComponent,
    ColumnSelectorComponent,
    BasicDTComponent,
    AddComponent,
    DataViewComponent,
    RowDetailComponent,
    AddEditComponent,
    ImportDataComponent,
    HeaderFilterComponent,
    FilterComponent,
    RelationshipComponent,
    FilterItemComponent,
    ArrayFilterPipe,
    EllipsisPipe,
    ViewDetailComponent
  ],
  providers: [DataTableService, PluralService]
})

export class WizeDataTableModule {
}
