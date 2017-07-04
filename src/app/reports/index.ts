import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule as HighChartModule} from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';
import {
  DataTableModule,
  ChartModule,
  SharedModule,
  ButtonModule,
  AccordionModule,
  RadioButtonModule,
  MultiSelectModule,
  TreeModule,
  TreeTableModule,
  TreeNode
} from 'primeng/primeng';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { DesignModule } from '../design/index';
import { ReportRoutingModule } from './routing';
import { ModalModule } from '../wize-ng2-core/features/modal/index';
import {
  ReportBuilderComponent,
  ReportListComponent,
  QuerySelectorComponent,
  FilterModalComponent,
  FilterModalService,
  PivotModalService,
  AutoCompleteComponent,
  ChartSelectorComponent,
  ReportListViewComponent,
  PivotModalComponent,
  FilterGroupComponent,
  PivotGroupComponent,
  CustomReportListViewComponent,
  ChartSupportComponent,
  CashflowComponent,
  DateRangeSelectorComponent
} from './components';

import { ReportsParamService } from './services/reports-params.service';
import { ReportsApiService } from './services/reports-api.service';
import { DatePickerDirective } from './directives/date-picker';
import { StrictInputLengthDirective } from './directives/strict-input-length.directive';

@NgModule({
  declarations: [
    ReportBuilderComponent,
    ReportListComponent,
    ReportListViewComponent,
    AutoCompleteComponent,
    QuerySelectorComponent,
    FilterModalComponent,
    ChartSelectorComponent,
    PivotModalComponent,
    FilterGroupComponent,
    PivotGroupComponent,
    CustomReportListViewComponent,
    ChartSupportComponent,
    CashflowComponent,
    DateRangeSelectorComponent,
    DatePickerDirective,
    StrictInputLengthDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    DataTableModule,
    SharedModule,
    ButtonModule,
    RadioButtonModule,
    AccordionModule,
    MultiSelectModule,
    ChartModule,
    ChartsModule,
    FormsModule,
    DesignModule,
    TreeModule,
    TreeTableModule,
    ModalModule,
    ReportRoutingModule
  ],
  exports: [
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useValue: highcharts
    },
    FilterModalService,
    PivotModalService,
    ReportsParamService,
    ReportsApiService
  ]
})

export class ReportsModule {
  constructor() {
    console.log('Analytics Module C\'tor');
  }
}
