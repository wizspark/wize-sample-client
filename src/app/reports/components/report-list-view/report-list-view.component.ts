import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CHART_COLORS } from '../../data/chart-colors';
import {ChartData, ScaleLabel, Scale} from '../../interfaces/chart-data';
import {ChartSettings} from '../../interfaces/chartSettings';
import {DataSet} from '../../interfaces/chart-data';
import {ReportsApiService} from '../../services/reports-api.service';
import {ReportsParamService} from  '../../services/reports-params.service';
import { UIChart} from 'primeng/primeng';


@Component({
  selector: 'report-list-view',
  templateUrl: './report-list-view.html',
  styleUrls: ['report-list-view.scss']
})
export class ReportListViewComponent implements OnInit {

  @Input("report") report: ChartSettings = null;
  @Input("queryResult") queryResult: any[];
  @Input("reportCategory") reportCategory: any;

  chartData: ChartData;
  tableDisplayColumns: any[] = [];

  isReady: boolean = false;

  // chartErrorFlag: boolean = false;
  // chartErrorMessage: string = "Something went wrong";
  @ViewChild('reportChart') reportChart: UIChart;

  constructor(private reportsApiService: ReportsApiService, private reportsParamService: ReportsParamService) {

  }

  ngOnInit() {
    this.chartData = this.report.chartSettings;
    this.display();
  }

  display(): void {
    //this.chartErrorFlag = false;
    this.chartData.chartErrorFlag = false;
    this.isReady = false;
    if(this.queryResult && this.queryResult.length > 0) {
      this.tableDisplayColumns =  this.report.dataQuery.tableDisplayColumns;
      switch (this.report.type) {
        case "bignumber":
          this.displayBigNumberChart();
          break;
        case "table":
          this.displayTableChart();
          break;
        default:
          this.chartData = this.reportsParamService.getChartData(this.report.dataQuery.tableDisplayColumns, this.chartData, this.queryResult);
          if(this.reportChart)
            this.reportChart.reinit();
          break;
      }
      this.isReady = true;
    } else {
      this.chartData.chartErrorFlag = true;
      this.chartData.chartErrorMessage = "No data found";
    }
  }

  /*displayChart() {
    this.chartData = this.report? this.report.chartSettings : (new ChartData());
    let measureExist = false;
    let pivotExist = false;
    let pivotExist1 = false;
    let typeCol = {};
    let colType = {};

    let cols = this.tableDisplayColumns;
    let colTypeArr = [];

    let dbMetaData = {};
    let dbMetaData1 = {};

    for (const field of this.reportCategory.ReportCategoryFields) {
      let modelName = field.modelName.toLowerCase();
      let columnName = field.columnName.toLowerCase();
      if(!dbMetaData[modelName]) {
        dbMetaData[modelName] = {};
      }
      let obj = {};
      let obj1 = {};
      obj1["type"] = field.dataType;
      obj[columnName] = obj1;
      dbMetaData[modelName][columnName] = obj1;
    }

    cols.forEach(function (col) {
      let obj1 = {};
      obj1["name"] = col;
      let colArr = col.split("_");
      if (colArr.length == 2) {
        let schemaDef = dbMetaData[colArr[0]];
        let obje = schemaDef[colArr[1]];
        obj1["type"] = obje.type;
      } else if (colArr.length == 3) {
        let schemaDef = dbMetaData[colArr[1]];
        let obje = schemaDef[colArr[2]];
        obj1["type"] = obje.type;
        if(colArr[0].toLowerCase() == "count") {
          obj1["type"] = "INTEGER";
        }
      } else {
        obj1["type"] = "STRING";
      }
      colTypeArr.push(obj1);
    });

    colTypeArr.forEach(function (col) {
      colType[col.name.toUpperCase()] = col.type;
      if (col.type == "FLOAT" || col.type == "INTEGER") {
        measureExist = true;
      }
      if(col.name.toUpperCase() == "RANGE0") {
        pivotExist = true;
        pivotExist1 = true;
      } else {
        typeCol[col.type] = col.name.toLowerCase();
      }
    });

    if (!measureExist) {
      this.chartErrorFlag = true;
      this.chartErrorMessage = "There should be at least one column with numeric data."
    }

    this.chartData.datasets = [];
    this.chartData.dataSetColumns = [];
    this.chartData.labels = [];

    let tempArr = [];
    let datasetArr = [];

    let labelColumn = "";
    if(typeCol["DATE"]) {
      labelColumn = typeCol["DATE"];
      this.chartData.labelColumn = labelColumn;
    } else if(typeCol["STRING"]) {
      labelColumn = typeCol["STRING"];
      this.chartData.labelColumn = labelColumn;
    }

    if(pivotExist) {
      for (let i = 0; i < this.queryResult.length; i++) {
        let obj = this.queryResult[i];
        let val = obj["range0"];
        if ((tempArr.indexOf(val) == -1)) {
          tempArr.push(val);
          let dataset: DataSet = new DataSet();
          dataset.label = val;
          datasetArr.push(dataset);
          this.chartData.dataSetColumns.push(val);
          this.chartData.datasets.push(dataset);
        }

        let label = obj[labelColumn];
        if ((this.chartData.labels.indexOf(label) == -1)) {
          this.chartData.labels.push(label);
        }
      }
      //this.chartData.labels.sort();
    }

    for (let i = 0; i < this.queryResult.length; i++) {
      let obj = this.queryResult[i];
      if(pivotExist) {
        let val = obj["range0"];
        let col = "";
        if(typeCol["INTEGER"]) {
          col = typeCol["INTEGER"];
        } else if(typeCol["FLOAT"]) {
          col = typeCol["FLOAT"];
        }

        for(let j=0;j<datasetArr.length; j++) {
          if(datasetArr[j].label == val) {
            for(let k=0; k<this.chartData.labels.length; k++) {
              if(obj[labelColumn] == this.chartData.labels[k]) {
                datasetArr[j].data[k] = obj[col];
              }
            }
          }
        }
      } else {
        for(let j=0;j<this.tableDisplayColumns.length;j++) {
          if(colType[this.tableDisplayColumns[j].toUpperCase()] == "FLOAT" || colType[this.tableDisplayColumns[j].toUpperCase()] == "INTEGER") {
            let val = this.tableDisplayColumns[j];
            if ((tempArr.indexOf(val) !== -1)) {
              datasetArr[tempArr.indexOf(val)].data.push(obj[val.toLowerCase()]);
            } else {
              tempArr.push(val);
              let dataset: DataSet = new DataSet();
              dataset.label = this.chartData.columns[val];
              dataset.data.push(obj[val.toLowerCase()]);
              datasetArr.push(dataset);
              this.chartData.dataSetColumns.push(val);
              this.chartData.datasets.push(dataset);
            }
          }
          let label = obj[labelColumn];
          if ((this.chartData.labels.indexOf(label) == -1)) {
            this.chartData.labels.push(label);
          }
        }
        this.chartData.labels.sort();
      }
    }
    for(let i=0; i<this.chartData.datasets.length; i++) {
      let index = this.chartData.chartColorsIndex[i];
      if(!index) index = i;
      this.setChartColor(this.chartData.datasets[i], index);
    }

    let scale = new Scale(),
      scaleLabel = new ScaleLabel();

    if (this.report.type == "bar" || this.report.type == "line") {
      scaleLabel["labelString"] = this.chartData.xAxisTitle;
      scale.scaleLabel = scaleLabel;

      this.chartData.options.scales.xAxes = [];
      this.chartData.options.scales.xAxes.push(scale);

      scale = new Scale();
      scaleLabel = new ScaleLabel();
      scaleLabel["labelString"] = this.chartData.yAxisTitle;
      scale.scaleLabel = scaleLabel;
      if(this.chartData.yAxisFormat && this.chartData.yAxisFormat == ".3s") {
        scale.ticks = {
          callback: function (value, index, values) {
            if (parseInt(value) > 999) {
              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else if (parseInt(value) < -999) {
              return '-$' + Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return '$' + value;
            }
          }
        };
      } else if(this.chartData.yAxisFormat && this.chartData.yAxisFormat == "$,.2f") {
        scale.ticks = {
          callback: function (value, index, values) {
            if (parseInt(value) > 999) {
              value = (Math.round(parseFloat(value) * 100) / 100).toFixed(2);
              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else if (parseInt(value) < -999) {
              return '-$' + Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return '$' + value;
            }
          }
        };
      }

      this.chartData.options.scales.yAxes = [];
      this.chartData.options.scales.yAxes.push(scale);
    } else {
      this.chartData.options.scales.xAxes = [];
      this.chartData.options.scales.yAxes = [];
    }
  }*/

  displayBigNumberChart() {
    let colName = this.tableDisplayColumns[0].columnName.toLowerCase();
    if (!this.chartData.title)
      this.chartData.title = colName;
    this.chartData.value = this.queryResult[0][colName];
  }

  displayTableChart() {
    if (!this.chartData.title)
      this.chartData.title = this.report.dataQuery.models[0];
  }

  /*private setChartColor(dataSet: DataSet, index: number): void {
    if (this.chartData.chartType === "bar") {
      dataSet.backgroundColor = this.getRandomColor(index);
    } else if (this.chartData.chartType === "pie" || this.chartData.chartType === "polararea") {
      dataSet.backgroundColor = [];
      for (let i = 0; i < dataSet.data.length; i++) {
        dataSet.backgroundColor.push(this.getRandomColor(i));
      }
    } else if (this.chartData.chartType === "line") {
      dataSet.borderColor = this.getRandomColor(index);
    } else if (this.chartData.chartType === "doughnut") {
      dataSet.backgroundColor = [];
      for (let i = 0; i < dataSet.data.length; i++) {
        dataSet.backgroundColor.push(this.getRandomColor(i));
      }
      if (!dataSet.hoverBackgroundColor) {
        dataSet.hoverBackgroundColor = [];
      }
      dataSet.hoverBackgroundColor.push(this.getRandomColor(index));
    } else if(this.chartData.chartType === "radar") {
      dataSet.backgroundColor = 'rgba(179,181,198,0.2)';
      dataSet.borderColor = 'rgba(179,181,198,1)';
      dataSet.pointBackgroundColor = 'rgba(179,181,198,1)';
      dataSet.pointBorderColor = '#fff';
      dataSet.pointHoverBackgroundColor = '#fff';
      dataSet.pointHoverBorderColor = 'rgba(179,181,198,1)';
    }
  }

  private getRandomColor(index: number): string {
    let color = "";
    if(index < CHART_COLORS.length) {
      color = CHART_COLORS[index];
    } else {
      index = Math.floor(Math.random() * (CHART_COLORS.length - 0 + 1)) + 0;
      color = CHART_COLORS[index];
    }
    return color;
  }*/

  private roundNumber(number, precision): number {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  private toDate(val): any {
    if(!val || val.length < 11) return val;
    var d = new Date(val);
    var datePipe = new DatePipe("UTC");
    return (!isNaN(d.valueOf())?datePipe.transform(val, 'MMM d, y h:mm a'):val);
  }
}
