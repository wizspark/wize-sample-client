import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import { TIME_SELECTORS } from './../data/time-selectors';
import { Utils } from '../../design/services/utils';
import {ChartData, ScaleLabel, Scale} from '../interfaces/chart-data';
import {DataSet} from '../interfaces/chart-data';
import { CHART_COLORS } from '../data/chart-colors';

@Injectable()
export class ReportsParamService {

  constructor() {

  }

  getParams(timeSelectorIndex: number, fromDate?: Date | string, toDate?: Date | string){
    let timeSelectors: Array<any> = TIME_SELECTORS,
        timeSelector: any;

    let params = <any>{},
        selector = TIME_SELECTORS[timeSelectorIndex],
        fDate = fromDate || Utils.parseTimePatterns(selector.range.from),
        tDate = toDate || Utils.parseTimePatterns(selector.range.to);
    params.startDate = +moment(fDate).startOf('day');
    params.endDate = +moment(tDate).endOf('day');
    params.timezone = momentTz. tz.guess();
    return params;
  }

  getChartData(tableDisplayColumns: any[], chartData: ChartData, queryResult: any[]): ChartData {
    if (!(tableDisplayColumns.length >= 2 && queryResult.length >= 1)) {
      chartData.chartErrorFlag = true;
      chartData.chartErrorMessage = "There should be at least two columns and at least one numeric.";
      return chartData;
    }

    let measureExist = false;
    let pivotExist = false;
    let pivotExist1 = false;
    let pivotCount = -1;
    let typeCol = {};
    let colType = {};

    tableDisplayColumns.forEach(function (col) {
      colType[col.columnName.toUpperCase()] = col.columnType;
      if (col.columnType == "FLOAT" || col.columnType == "INTEGER" || col.columnType == "DOUBLE") {
        measureExist = true;
      }
      if(col.columnName.toUpperCase().startsWith("RANGE")) {
        pivotExist = true;
        pivotExist1 = true;
        pivotCount++;
      } else {
        typeCol[col.columnType] = col.columnName.toLowerCase();
      }
    });

    if (!measureExist) {
      chartData.chartErrorFlag = true;
      chartData.chartErrorMessage = "There should be at least one column with numeric data.";
      return chartData;
    }

    chartData.datasets = [];
    chartData.dataSetColumns = [];
    chartData.labels = [];

    let tempArr = [];
    let datasetArr = [];

    let labelColumn = "";
    let labelType = "";
    if(typeCol["DATE"]) {
      labelType = "DATE";
      labelColumn = typeCol["DATE"];
      chartData.labelColumn = labelColumn;
    } else if(typeCol["STRING"]) {
      labelColumn = typeCol["STRING"];
      chartData.labelColumn = labelColumn;
    }

    if(pivotExist) {
      for (let i = 0; i < queryResult.length; i++) {
        let obj = queryResult[i];
        for(let i=0; i<=pivotCount; i++) {
          let val = obj["range"+i];
          if ((tempArr.indexOf(val) == -1)) {
            tempArr.push(val);
            let dataset: DataSet = new DataSet();
            dataset.label = val;
            datasetArr.push(dataset);
            chartData.dataSetColumns.push(val);
            chartData.datasets.push(dataset);
          }

          let label = (labelType === "DATE")?this.toDate(obj[labelColumn]):obj[labelColumn];
          if ((chartData.labels.indexOf(label) == -1)) {
            chartData.labels.push(label);
          }
        }
      }
    }

    for (let i = 0; i < queryResult.length; i++) {
      let obj = queryResult[i];
      if(pivotExist) {
        for(let i=0; i<=pivotCount; i++) {
          let val = obj["range"+i];
          let col = "";
          if (typeCol["INTEGER"]) {
            col = typeCol["INTEGER"];
          } else if (typeCol["FLOAT"]) {
            col = typeCol["FLOAT"];
          } else if (typeCol["DOUBLE"]) {
            col = typeCol["DOUBLE"];
          }

          for (let j = 0; j < datasetArr.length; j++) {
            if (datasetArr[j].label == val) {
              for (let k = 0; k < chartData.labels.length; k++) {
                if (obj[labelColumn] == chartData.labels[k]) {
                  datasetArr[j].data[k] = obj[col];
                }
              }
            }
          }
        }
      } else {
        for(let j=0;j<tableDisplayColumns.length;j++) {
          if(colType[tableDisplayColumns[j].columnName.toUpperCase()] == "FLOAT" || colType[tableDisplayColumns[j].columnName.toUpperCase()] == "INTEGER" || colType[tableDisplayColumns[j].columnName.toUpperCase()] == "DOUBLE") {
            let val = tableDisplayColumns[j].columnName;
            if ((tempArr.indexOf(val) !== -1)) {
              datasetArr[tempArr.indexOf(val)].data.push(this.roundNumber(obj[val.toLowerCase()], 2));
            } else {
              tempArr.push(val);
              let dataset: DataSet = new DataSet();
              dataset.label = chartData.columns[val];
              dataset.data.push(this.roundNumber(obj[val.toLowerCase()], 2));
              datasetArr.push(dataset);
              chartData.dataSetColumns.push(val);
              chartData.datasets.push(dataset);
            }
          }
          let label = (labelType === "DATE")?this.toDate(obj[labelColumn]):obj[labelColumn];
          if ((chartData.labels.indexOf(label) == -1)) {
            chartData.labels.push(label);
          }
        }
      }
    }

    for(let i=0; i<chartData.datasets.length; i++) {
      // let index = this.getRandomIndex();
      // while(this.chartData.chartColorsIndex.indexOf(index) !== -1)
      //   index = this.getRandomIndex();
      chartData.chartColorsIndex.push(i);
      this.setChartColor(chartData.chartType, chartData.datasets[i], i);
    }

    chartData.options.title.text = chartData.title;
    let scale = new Scale(),
      scaleLabel = new ScaleLabel();

    if (chartData.chartType == "bar" || chartData.chartType == "line") {
      scaleLabel["labelString"] = chartData.xAxisTitle;
      scale.scaleLabel = scaleLabel;

      chartData.options.scales.xAxes = [];
      chartData.options.scales.xAxes.push(scale);

      scale = new Scale();
      scaleLabel = new ScaleLabel();
      scaleLabel["labelString"] = chartData.yAxisTitle;
      scale.scaleLabel = scaleLabel;
      if(chartData.yAxisFormat && chartData.yAxisFormat == ".3s") {
        scale.ticks = {
          callback: function (value, index, values) {
            if (parseInt(value) > 999) {
              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else if (parseInt(value) < -999) {
              return '-$' + Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return '$' + value;
            }
          },
          beginAtZero: true
        };
      } else if(chartData.yAxisFormat && chartData.yAxisFormat == "$,.2f") {
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
          },
          beginAtZero: true
        };
      } else {
        scale.ticks = {
          beginAtZero: true
        }
      }

      chartData.options.scales.yAxes = [];
      chartData.options.scales.yAxes.push(scale);
    } else {
      //chartData.options.legend.position = "bottom";
      chartData.options.scales.xAxes = [];
      chartData.options.scales.yAxes = [];
    }
    chartData.initialized = true;
    return chartData;
  }

  private setChartColor(chartType: string, dataSet: DataSet, index: number): void {
    if (chartType === "bar") {
      dataSet.backgroundColor = this.getRandomColor(index);
    } else if (chartType === "pie" || chartType === "polarArea") {
      dataSet.backgroundColor = [];
      for (let i = 0; i < dataSet.data.length; i++) {
        dataSet.backgroundColor.push(this.getRandomColor(i));
      }
    } else if (chartType === "line") {
      dataSet.borderColor = this.getRandomColor(index);
    } else if (chartType === "doughnut") {
      dataSet.backgroundColor = [];
      for (let i = 0; i < dataSet.data.length; i++) {
        dataSet.backgroundColor.push(this.getRandomColor(i));
      }
      if (!dataSet.hoverBackgroundColor) {
        dataSet.hoverBackgroundColor = [];
      }
      dataSet.hoverBackgroundColor.push(this.getRandomColor(index));
    } else if(chartType === "radar") {
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
  }

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
