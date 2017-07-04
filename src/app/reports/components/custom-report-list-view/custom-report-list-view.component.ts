import { Component, OnInit, Input } from '@angular/core';

import {ChartData} from '../../interfaces/chart-data';
import {ChartSettings} from '../../interfaces/chartSettings';
import {DataSet} from '../../interfaces/chart-data';
import {ReportsApiService} from '../../services/reports-api.service';
import {ReportsParamService} from  '../../services/reports-params.service';


@Component({
  selector: 'custom-report-list-view',
  templateUrl: './custom-report-list-view.html',
  styleUrls: ['custom-report-list-view.scss']
})
export class CustomReportListViewComponent implements OnInit {

  @Input("report") report: any = null;

  chartData: any = null;
  isReady: boolean = false;

  chartErrorFlag: boolean = false;
  chartErrorMessage: string = "Something went wrong";

  constructor(private reportsApiService: ReportsApiService, private reportsParamService: ReportsParamService) {

  }

  ngOnInit() {
    this.chartData = this.report;
    this.display();
  }

  display(): void {
    this.chartErrorFlag = false;
    this.isReady = false;
    this.displayChart();
  }

  displayChart() {

  }

}
