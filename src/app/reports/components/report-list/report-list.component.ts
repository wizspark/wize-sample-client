import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreToastManager } from '../../../root/services/core-toast-manager';
import { IConfirmation } from '../../../design/interfaces/confimation';
import { ConfirmationService } from '../../../design/components/confirmation/confirmation.service';
import { TIME_SELECTORS } from '../../data/time-selectors';
import { ReportsApiService } from '../../services/reports-api.service';
import { ReportsParamService } from  '../../services/reports-params.service';
import {ReportBuilderComponent} from "../report-builder/report-builder.component";
import * as moment from 'moment';
import { Utils } from '../../../design/services/utils';
import {ReportListViewComponent} from "../report-list-view/report-list-view.component";
import {ChartSettings} from "../../interfaces/chartSettings";
const DATE_FORMAT = 'MM-DD-YYYY';

@Component({
  selector: 'report-list',
  templateUrl: './report-list.html',
  styleUrls: ['report-list.scss'],
  providers: [ ConfirmationService ]
})
/**
 * ReportListComponent is the main component which loads all existing reports, display them on UI in datatable.
 * It gives user an option to create new report, edit or view existing report.
 */
export class ReportListComponent implements OnInit {

  @ViewChild('builder') builder:ReportBuilderComponent; //Report Builder component used to create/edit custom report.
  @ViewChild('reportViewer') reportViewer:ReportListViewComponent; //Report viewer component used to view custom report.

  reportStatus: string = "list"; //To maintain the view state on UI.
  time: any = null;

  allReportsData: any[] = []; //List all existing custom reports.
  reportCategories: any[]; //List of Report categories from which user can create/edit custom report.

  queryResult: any[]; //Result from database against custom query.
  report: ChartSettings; //Report object selected by user to create/view/edit/delete.
  reportCategory: any; //In case of edit report, report belongs to this query.
  staticReport: any = null; //Contains static report information

  isEnableCreateEditReport: boolean = false; /*
                                              * isEnableCreateEditReport hold boolena values which shows when the
                                              * save button for create and edit Report Builder should enable or disable
                                              */

  /**
   * Constructor
   * @param confirmationService - To show confirmation popup model.
   * @param reportsApiService - To fetch reports data from backend & execute queries.
   * @param reportsParamService - To populate time range filter in query params. Also to populate chart data.
   */
  constructor(private toastr: CoreToastManager,
              private confirmationService: ConfirmationService,
              private reportsApiService: ReportsApiService,
              private reportsParamService: ReportsParamService,
              private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      if(this.time === null || this.time != params['q']) {
        this.reportStatus = "list";
        this.getAllReports();
      }
      this.time = params['q'];
    });
  }

  /**
   * Initialize all reports, date range for date filter & report categories meta information to create/edit/view reports.
   */
  ngOnInit() {
    this.getAllReports();
    //this.initDateRange();
    this.initReportCategories();

  }

  /**
   * Fetch all existing reports for existing user has access to public and users specific private reports.[Access=everyOne & access=onlyMe].
   */
  private getAllReports() {
    /*
    *
    * */
    this.isEnableCreateEditReport = false;

    //let params = this.reportsParamService.getParams(3,this.fromDate, this.toDate);
    this.reportsApiService.getAllReports(null).subscribe((record: any) => {
      this.allReportsData = record.rows;
    });
  }

  /**
   * Fetch all report categories meta information. It is required while create/edit/view report data.
   * Report categories information is fetched here keeping in mind that user may view multiple reports. Once fetched here used anywhere.
   */
  private initReportCategories() {
    this.reportsApiService.getReportsCategories().subscribe((categories: any) => {
      this.reportCategories = categories.rows;
    });
  }

  /**
   * This method is called on save chart event from report-builder.
   */
  private onSaveChart(report:ChartSettings) {
    if(this.reportStatus == "create") {
      this.reportsApiService.saveChartSettings(report).subscribe((records: any) => {
        this.toastr.success("Successfully Created","Report");
        this.getAllReports();
        this.reportStatus = "list";
      });
    } else {
      this.reportsApiService.updateChartSettings(report).subscribe((records: any) => {
        this.toastr.success("Successfully Updated","Report");
        this.getAllReports();
        this.reportStatus = "list";
      });
    }
  }

  /*
  * onSaveChartActivate will be called trigger from Report Builder Component
  * */
  private onSaveChartActivate(status: boolean){
    this.isEnableCreateEditReport = status;
  }

  onDateRangeChange({from, to}) {
    let params = this.reportsParamService.getParams(3,from, to);
    this.executeQuery(params);
    setTimeout(() => {
      this.reportViewer.display();
    }, 100)
  }
  /**
   * This method is executed for if user wants to create/view/edit report.
   * It is entry point to report-builder, report-viewer or static reports.
   */
  private reportAction(actionType: string, rowData: any) {
    switch (actionType) {
      case 'create':
        this.isEnableCreateEditReport = false;
        this.queryResult = [];
        this.report = new ChartSettings();
        this.reportCategory = null;
        this.reportStatus = "create";
        break;
      case  'view':
        this.isEnableCreateEditReport = true;
        this.staticReport = null;
        this.report = rowData;
        this.reportCategory = JSON.parse(JSON.stringify(this.getReportCategoryObj(this.report)));
        this.reportsApiService.postQuery(null, this.report.dataQuery)
          .subscribe(response => {
            this.queryResult = response;
            this.reportStatus = "view";
          }, err => {
            this.queryResult = [];
          });
        break;
      case 'edit':
        this.staticReport = null;
        this.isEnableCreateEditReport = true;
        this.report = rowData;
        this.reportCategory = JSON.parse(JSON.stringify(this.getReportCategoryObj(this.report)));
        this.reportsApiService.postQuery(null, this.report.dataQuery)
          .subscribe(response => {
            this.queryResult = response;
            this.reportStatus = "edit";
          }, err => {
            this.queryResult = [];
          });
        break;
      case 'delete':
        this.report = rowData;
        this.deleteReport();
        break;
      case 'list':
        this.queryResult = [];
        this.report = new ChartSettings();
        this.reportStatus = "list";
        break;
      case 'customview':
        this.staticReport = rowData;
        this.reportStatus = "customview";
        break;
      default:
        this.reportStatus = "list";
        break;
    }
  }

  /**
   * This method is here just to implement time filter from view.
   * Same method can be found in viewer.
   * @param params
   */
  private executeQuery(params: any) {
    this.reportsApiService.postQuery(params, this.report.dataQuery)
      .subscribe(response => {
        this.queryResult = response;
      }, err => {
        this.queryResult = [];
      });
  }

  /**
   * This method return report category for an existing custom report.
   * Report category is required to get report category fields and meta information.
   * @param report
   */
  private getReportCategoryObj(report: any) {
    for(let i=0; i<this.reportCategories.length; i++) {
      let category = this.reportCategories[i];
      if(category.id == report.ReportCategoryId) {
        return category;
      }
    }
  }

  /**
   * Confirmation model for saving report.
   */
  private saveNewReport() {
    let discardConfirmation: IConfirmation = <IConfirmation>{
      title: 'Create Report',
      message: `Do you want to create new Report ?`,
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(discardConfirmation).then((responseOK) => {
      if (responseOK) {
        this.builder.saveChart();
      }
    });
  }

  /**
   * Confirmation model for updating report.
   */
  private updateReport() {
    let discardConfirmation: IConfirmation = <IConfirmation>{
      title: 'Update Report',
      message: `Do you want to update Report ?`,
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(discardConfirmation).then((responseOK) => {
      if (responseOK) {
        this.builder.saveChart();
      }
    });
  }

  /**
   * Confirmation model for deleting report.
   */
  private deleteReport() {
    let discardConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Report',
      message: `Are you sure you want to delete ?`,
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(discardConfirmation).then((responseOK) => {
      if (responseOK) {
        this.reportsApiService.deleteChartSettings(this.report.id).subscribe((response) => {
          this.toastr.success("Successfully Deleted","Report");
          this.getAllReports();
          this.reportStatus = "list";
        });
      }
    });
  }

  /**
   * Confirmation model to discard changes in update report.
   */
  private cancelUpdateReport() {
    let discardConfirmation: IConfirmation = <IConfirmation>{
      title: 'Update Report',
      message: `Do you want to discard report changes`,
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(discardConfirmation).then((responseOK) => {
      if (responseOK) {
        this.reportStatus = "list";
      }
    });
  }

  /**
   * Confirmation model to discard changes in create report.
   */
  private cancelReportBuilderView() {
    let discardConfirmation: IConfirmation = <IConfirmation>{
      title: 'Report Confirmation',
      message: `Do you want to discard report changes ?`,
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(discardConfirmation).then((responseOK) => {
      if (responseOK) {
        this.reportStatus = "list";
      }
    });
  }
}
