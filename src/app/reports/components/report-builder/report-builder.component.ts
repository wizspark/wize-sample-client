import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import {QuerySelector} from "../../interfaces/query-selector";
import { ACCORDION_SECTIONS } from '../../data/accordion-sections';
import {
  Query
} from "../../interfaces/query"
import {ChartData} from '../../interfaces/chart-data';
import {ReportsApiService} from '../../services/reports-api.service';
import {ReportsParamService} from  '../../services/reports-params.service';
import {PivotGroup, FilterGroup} from "../../interfaces/filter-group";
import {ChartSettings} from "../../interfaces/chartSettings";
import { UIChart} from 'primeng/primeng'
//import {setTimeout} from "timers";

@Component({
  selector: 'report-builder',
  templateUrl: './report-builder.html',
  styleUrls: ['report-builder.scss']
})
/**
 * ReportBuilderComponent is responsible to create & edit custom report by user.
 * Create Report/ Edit Report are the entry reports from UI to load this component.
 * It has dependency on some inputs and relies on its parent component ReportListComponent
 * to execute query and save charts.
 */
export class ReportBuilderComponent implements OnInit {

  @Input() queryResult: any[]; //Input to display database rows returned by execute query. TODO make it local.
  @Input() report: ChartSettings; //Report object - representing ChartSettings table in DB.
  @Input() reportCategories: any[]; //All report categories from which user can create custom report.
  @Input() reportCategory: any; //Report categories to which custom report belongs.

  @Output() onSaveActivate: EventEmitter<boolean> = new EventEmitter<boolean>(); //When ReportValidation will be fine save button activation event will fire with true status else false
  @Output() onSaveChart: EventEmitter<any> = new EventEmitter<any>(); //Event to save chart TODO remove this.

  @ViewChild('reportChart') reportChart: UIChart;
  //dataQuery: Query; //DataQuery object contains information required to execute custom query in DB.
  chartData: ChartData; //ChartData contains chart data & chart settings to display chart on UI.
  tableDisplayColumns: any[] = []; //This array contains information to display columns on UI tables.
  queryErrorMessage: string =  "No Record Found"; //In case there is any error while executing query in DB.
  reportCategoryFields: any[] = []; //To display all fields in a report category on UI.

  accordionConfig: any = {};//To manage th accordion panel state.
  @ViewChild('queryDiv') queryDiv; //To fetch the height of div.
  previewChart: boolean = false; //Flag to display/hide chart.
  initialized: boolean = false; //Flag to load UI after initialization.
  chartType: string = "table";

  //querySelector: QuerySelector = new QuerySelector();
  pivotGroup: PivotGroup = new PivotGroup();
  filterGroup: FilterGroup = new FilterGroup();

  /**
   * @param reportsApiService - To fetch charts data and execute queries.
   * @param reportsParamService - To set time range filter & get chart data.
   */
  constructor(private reportsApiService: ReportsApiService, private reportsParamService: ReportsParamService) {

  }

  /**
   * Initialize reports object and related objects.
   * If passed as input then Ok else initialize as new object.
   * Initialize accordion panel as well.
   */
  ngOnInit() {
    this.report = this.report || (new ChartSettings());
    this.queryResult = this.queryResult || [];
    this.reportCategory = this.reportCategory || {};
    this.reportCategoryFields = this.reportCategory && this.reportCategory.ReportCategoryFields?this.reportCategory.ReportCategoryFields:[];
    this.chartData = this.report && this.report.chartSettings? this.report.chartSettings : (new ChartData());
    //this.dataQuery = this.report && this.report.dataQuery? this.report.dataQuery : (new Query());
    this.tableDisplayColumns = this.report && this.report.dataQuery && this.report.dataQuery.tableDisplayColumns? this.report.dataQuery.tableDisplayColumns : [];
    this.pivotGroup = (this.report && this.report.dataQuery && this.report.dataQuery.pivots[0]?this.report.dataQuery.pivots[0]:new PivotGroup());
    this.filterGroup = (this.report && this.report.dataQuery && this.report.dataQuery.filters[0]?this.report.dataQuery.filters[0]:new FilterGroup());

    if(this.tableDisplayColumns && this.tableDisplayColumns.length > 0) {
      for(let j=0;j<this.reportCategoryFields.length;j++) {
        let field = this.reportCategoryFields[j];
        let func, colName, modelName = "";
        for(let i=0;i<this.tableDisplayColumns.length;i++) {
          const col = this.tableDisplayColumns[i];
          let arr = col.columnName.split("_");
          if(arr.length > 2) {
            func = arr[0];
            modelName = arr[1];
            colName = arr[2];
          } else {
            func = "";
            modelName = arr[0];
            colName = arr[1];
          }
          if(field.columnName.toLowerCase() == colName && field.modelName.toLowerCase() == modelName) break;
        }

        if(field.columnName.toLowerCase() == colName && field.modelName.toLowerCase() == modelName) {
          field.isDefault = true;
          this.setFunction(func, field);
        } else {
          field.isDefault = false;
        }
      }
    }
    this.chartData.initialized = false;
    this.accordionConfig = {};
    this.accordionConfig.sections = ACCORDION_SECTIONS;
    this.accordionConfig.activeSection = '0';
    this.saveActivate();
  }

  /**
   * This method executes on change of accordion panel tab.
   * @param event
   * @param accordion
   */
  private onAccordionSelect(event: any, accordion) {
    this.previewChart = false;
    this.accordionConfig.activeSection = accordion.key;
    //if(!this.chartData) this.chartData = new ChartData();
    this.chartData.initialized = false;
    if (accordion.key == "1") {
      this.executeQuery(this.getCustomQueryObj1());
    } else if (accordion.key == "2") {
      this.report.type = this.report.type || "table";
      this.chartData.chartType = this.chartData.chartType || "table";
      this.chartData.title = this.chartData.title || this.reportCategory.name;
      for(let i=0;i<this.tableDisplayColumns.length;i++) {
        if(!this.chartData.columns[this.tableDisplayColumns[i].columnName]) {
          this.chartData.columns[this.tableDisplayColumns[i].columnName] = this.tableDisplayColumns[i].columnHeader;
        }
      }
      this.onPreviewChart(this.chartData);
      this.initialized = true;
    }
  }

  /**
   * This method executes the raw query in DB as per user selection. Display the result as table on UI.
   * It also populates the tableDisplayColumn if user has selected any Pivot on UI.
   * @param query
   */
  private executeQuery(query: Query): void {
    if(query.tableDisplayColumns.length>0){
      this.queryErrorMessage = "No Record Found";
      this.reportsApiService.postQuery(null, query)
        .subscribe(response => {
          this.queryResult = response;
          if(this.queryResult && this.queryResult.length > 0) {
            let tempTableDisplayColumns =  Object.keys(this.queryResult[0]);
            for(let i=0; i<3;i++) {
              if(tempTableDisplayColumns.indexOf("range" + i) !== -1) {
                let obj = {};
                obj["columnName"] = "range" + i;
                obj["columnHeader"] = "CASE " + i + " Label";
                obj["columnType"] = "STRING";
                this.tableDisplayColumns.push(obj);
              }
            }
          }
          this.saveActivate();
        }, err => {
          this.queryResult = [];
          this.queryErrorMessage = err._body;
          this.saveActivate();
        });
    }else{
      this.queryErrorMessage = "Fill the form details in the left and click on \"Apply\" Button";
    }
  }

  onChartChange(chartType: string) {
    this.chartData.chartErrorFlag = false;
    this.previewChart = false;
    this.chartData.initialized = false;
    this.report.type = this.chartData.chartType;
    this.saveActivate();
  }

  public onChange(model: string): void {
    this.queryResult = [];
    this.queryErrorMessage = "Fill the form details in the left and click on \"Preview Data\" Button";
    this.saveActivate();
  }

  public onPreviewData(obj: any): void {
    this.pivotGroup = obj.pivotGroup;
    this.filterGroup = obj.filterGroup;
    this.queryResult = [];
    this.executeQuery(this.getCustomQueryObj1());
  }

  onPreviewChart(chartData: ChartData): void {
    this.chartData = chartData;
    this.report.type = chartData.chartType;
    this.chartType = this.chartData.chartType;
    switch (this.report.type) {
      case "bignumber":
        this.displayBigNumberChart();
        this.previewChart = true;
        this.chartType = this.chartData.chartType;
        break;
      case "table":
        this.displayTableChart();
        this.previewChart = true;
        this.chartType = this.chartData.chartType;
        break;
      default:
        this.chartData = this.reportsParamService.getChartData(this.tableDisplayColumns, this.chartData, this.queryResult);
        // if(!this.chartData.chartErrorFlag && !this.reportChart) {
        //
        // }
        //let self = this;
        setTimeout(() => {
          this.reportChart.reinit();
        }, 10);
        break;
    }
    this.previewChart = true;
    this.saveActivate();
  }

  saveChart(): void {
    this.previewChart = false;
    this.report.dataQuery = this.getCustomQueryObj1();
    this.report.chartSettings = this.chartData;
    this.report.chartSettings.labels = [];
    this.report.chartSettings.datasets = [];
    this.onSaveChart.emit(this.report);
  }

  saveActivate(): void {
    this.onSaveActivate.emit((this.queryResult.length > 0 && this.validateReportDetails() && (this.report.name && this.report.name!='')));
  }

  isTableChartEnabled() {
    return (this.tableDisplayColumns.length > 0 && this.queryResult.length >= 1);
  }

  isNumberChartEnabled() {
    return (this.tableDisplayColumns.length == 1 && this.queryResult.length == 1);
  }

  displayBigNumberChart() {
    if (this.isNumberChartEnabled()) {
      let colName = this.tableDisplayColumns[0].columnName.toLowerCase();
      if (!this.chartData.title)
        this.chartData.title = colName;
      this.chartData.value = this.queryResult[0][colName];
    } else {
      this.chartData.chartErrorFlag = true;
      this.chartData.chartErrorMessage = "There should be only one value to be displayed in single value chart type."
    }
  }

  displayTableChart() {
     //if (!this.chartData.title)
       //this.chartData.title = this.querySelector.modelName;
  }

  private onReportCategoryChange(modelSelector) {
    for(let i=0;i<this.reportCategories.length;i++) {
      let category = this.reportCategories[i];
      if(category.id == modelSelector) {
        //this.report = new ChartSettings();
        this.report.ReportCategoryId = category.id;
        //this.querySelector = new QuerySelector();
        this.chartData = new ChartData();
        this.reportCategory = category;
        //this.dataQuery = new Query();
        this.pivotGroup = new PivotGroup();
        this.filterGroup = new FilterGroup();
        this.tableDisplayColumns = [];
        this.reportCategoryFields = category.ReportCategoryFields;
        this.reportCategoryFields.forEach(function (field) {
          field.function = "";
        });
      }
    }
    this.saveActivate();
  }

  private getCustomQueryObj1(): any {
    this.tableDisplayColumns = [];
    let query = new Query();
    query.models.push(this.reportCategory.modelName);
    let relationColObj = {};

    for(let j=0;j<this.reportCategoryFields.length;j++) {
      let field = this.reportCategoryFields[j];
      if (field.isDefault == true && (field.dataType == 'INTEGER' || field.dataType == 'DOUBLE' || field.dataType == 'FLOAT' || field.dataType == 'DATE')) {
        if(field.function) {
          let obj = {};
          obj["function"] = field.function;
          obj["column"] = field.modelName + "." + field.columnName;
          query.metrics.push(obj);

          let obj1 = {};
          obj1["columnName"] = (field.function + "_" + field.modelName + "_" + field.columnName).toLowerCase();
          obj1["columnHeader"] = field.displayValue?field.displayValue:field.name;
          obj1["columnType"] = (field.function == "count"?"INTEGER":field.dataType);
          this.tableDisplayColumns.push(obj1);

          if(field.dataType == "DATE") {
            query.groupby.push(field.modelName + "." + field.columnName);
          }

          if (field.modelName != this.reportCategory.modelName) {
            if (!relationColObj[field.modelName]) {
              relationColObj[field.modelName] = [];
            }
          }
        } else {
          if (field.modelName != this.reportCategory.modelName) {
            if (!relationColObj[field.modelName]) {
              relationColObj[field.modelName] = [];
            }
            relationColObj[field.modelName].push(field.columnName);
          } else {
            query.columns.push(field.columnName);
          }
          query.groupby.push(field.modelName + "." + field.columnName);
          let obj = {};
          obj["columnName"] = (field.modelName + "_" + field.columnName).toLowerCase();
          obj["columnHeader"] = field.name;
          obj["columnType"] = field.dataType;
          this.tableDisplayColumns.push(obj);
        }
      }
    }

    for(let j=0;j<this.reportCategoryFields.length;j++) {
      let field = this.reportCategoryFields[j];
      if (field.isDefault == true && (field.dataType == 'STRING' || field.dataType == 'BOOLEAN')) {
        if(field.function) {
          let obj = {};
          obj["function"] = field.function;
          obj["column"] = field.modelName + "." + field.columnName;
          query.metrics.push(obj);

          let obj1 = {};
          obj1["columnName"] = (field.function + "_" + field.modelName + "_" + field.columnName).toLowerCase();
          obj1["columnHeader"] = field.displayValue?field.displayValue:field.name;
          obj1["columnType"] = (field.function == "count"?"INTEGER":field.dataType);
          this.tableDisplayColumns.push(obj1);

          if(field.dataType == "DATE") {
            query.groupby.push(field.modelName + "." + field.columnName);
          }

          if (field.modelName != this.reportCategory.modelName) {
            if (!relationColObj[field.modelName]) {
              relationColObj[field.modelName] = [];
            }
          }
        } else {
          if (field.modelName != this.reportCategory.modelName) {
            if (!relationColObj[field.modelName]) {
              relationColObj[field.modelName] = [];
            }
            relationColObj[field.modelName].push(field.columnName);
          } else {
            query.columns.push(field.columnName);
          }
          query.groupby.push(field.modelName + "." + field.columnName);
          let obj = {};
          obj["columnName"] = (field.modelName + "_" + field.columnName).toLowerCase();
          obj["columnHeader"] = field.name;
          obj["columnType"] = field.dataType;
          this.tableDisplayColumns.push(obj);
        }
      }
    }

    for (let key in relationColObj) {
      if (relationColObj.hasOwnProperty(key)) {
        let obj = {};
        obj[key] = relationColObj[key];
        query.relations.push(obj);
      }
    }
    query.filters.push(this.filterGroup);
    query.pivots.push(this.pivotGroup);
    query.tableDisplayColumns = this.tableDisplayColumns;
    this.saveActivate();
    return query;
  }

  validateReportDetails(){
    return ((this.report.ReportCategoryId)?true:false);
  }
  // validateMGF(){
  //   this.isValidateMGF = this.validateReportDetails()?true:false;
  //   return this.isValidateMGF;
  // }
  // validateChartSettings(){
  //   this.isValidateChartSettings = (this.validateReportDetails() && this.validateMGF())?true:false;
  //   return this.isValidateChartSettings;
  // }
  //

  toggleVisibleState(event){
    event.preventDefault();
    setTimeout(() => {
      this.report.access = event.target.value;
    });
  }


  private getField(field): string {
    let fieldVal = (field.modelName + "_" + field.columnName).toLowerCase();
    return fieldVal;
  }
  private reportNameChange(event){
    this.saveActivate();
  }
  private getHeigthDy(): string {
    return (this.queryDiv && this.queryDiv.nativeElement && this.queryDiv.nativeElement.clientHeight-85 > 650)?this.queryDiv.nativeElement.clientHeight-81 + "px":650 + "px";
  }

  /**
   * On change of checkbox on each field, this method maintains the
   * field's function & display value.
   * @param val
   * @param field
   */
  private setFunction(val, field): void {
    if(val == "sum") {
      field.function = val;
      field.displayValue = "Sum of " + field.name;
      field.isDefault = true;
    } else if(val == "count") {
      field.function = val;
      field.displayValue = "Count of " + field.name;
    } else if(val == "avg") {
      field.function = val;
      field.displayValue = "Average of " + field.name;
    } else if(val == "day") {
      field.function = val;
      field.displayValue = "Day of " + field.name;
    } else if(val == "month") {
      field.function = val;
      field.displayValue = "Month of " + field.name;
    } else if(val == "quarter") {
      field.function = val;
      field.displayValue = "Quarter of " + field.name;
    } else if(val == "year") {
      field.function = val;
      field.displayValue = "Year of " + field.name;
    } else {
      field.function = val;
      field.displayValue = field.name;
    }
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
