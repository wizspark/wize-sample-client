import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartData } from '../../interfaces/chart-data';

@Component({
  selector: 'app-chart-selector',
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss']
})
export class ChartSelectorComponent implements OnInit {

  @Input() chartData: ChartData;
  @Input() displayColumns: any[];

  @Output() submit: EventEmitter<ChartData> = new EventEmitter<ChartData>();
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
    this.selectChart(this.chartData.chartType);
    this.displayColumns = (this.displayColumns?(this.displayColumns.length>0?this.displayColumns:[]):[]);
  }

  selectChart(chartSelector) {
    this.chartData.chartType = chartSelector;
    if(chartSelector == "table") {
      for(let i=0;i<this.displayColumns.length;i++) {
        if(!this.chartData.columns[this.displayColumns[i].columnName]) {
          this.chartData.columns[this.displayColumns[i].columnName] = this.displayColumns[i].columnHeader;
        }
      }
    }
    this.onChange.emit(chartSelector);
  }

  previewChart() {
    this.submit.emit(this.chartData);
  }
}
