import {Component, OnInit, ViewChild} from '@angular/core';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';
import { ReportApiService } from "../../../services/reports-api.service";
import { DynamicHeight } from "../../../services/reports.service";
import {ReportCategory, ReportCategoryField} from "../../interfaces/report-category";
import { ConfirmationService, IConfirmation } from '../../../shared/index';
import {ReportCategoryComponent} from "../report-category/report-category.component";

@Component({
  selector: 'report-category-list',
  templateUrl: './report-category-list.html'
})
export class ReportCategoryListComponent implements OnInit {

  reportCategories: ReportCategory[];
  pageStatus: string = "list";
  reportCategory: ReportCategory;
  saveUpdateReportCategory: ReportCategory;
  isReportSaveActivate: boolean = false;
  isCloneReport: boolean = false;

  @ViewChild('reportCategoryInstance') reportCategoryInstance: ReportCategoryComponent;

  constructor(private toastr: CoreToastManager,
              private reportService: ReportApiService,
              private confirmationService: ConfirmationService,
              private dynamicHeight: DynamicHeight) {
    this.getAllReportCategories();
  }

  ngOnInit() {

  }

  private getAllReportCategories(callback?: Function) {
    this.reportService.getReportsCategories().subscribe((records: any) => {
      this.reportCategories = records.rows;
      if(callback){
        callback();
      }
    });
  }

  private deleteReportCategory(id, callback?: Function) {
    this.confirmation('Warning',`Deleting report category will affect related generated reports. Continue ?`,(status: boolean) => {
      if(status){
        this.reportService.deleteReportCategory(id).subscribe((response) => {
          this.toastr.success("Deleted Successfully", "Report Category");
          this.getAllReportCategories();
          this.pageStatus = "list";
          if(callback) {
            callback(response);
          }
        });
      }
    });
  }

  private updateReportCategory() {

    this.reportService.updateReportCategories(this.createReportBuild(this.saveUpdateReportCategory)).subscribe((res) => {
      this.toastr.success("Updated Successfully", "Report Category");
      this.getAllReportCategories(() => {
        this.pageStatus = "list";
      });
    });

  }

  private createReportBuild(saveUpdateReportCategory: ReportCategory){

    saveUpdateReportCategory.access = "EveryOne";
    saveUpdateReportCategory.isActive = true;
    delete saveUpdateReportCategory.selected;
    let cols: ReportCategoryField[] = [];

    for(let colIndex = 0; colIndex < saveUpdateReportCategory.ReportCategoryFields.length; colIndex++){
      if(saveUpdateReportCategory.ReportCategoryFields[colIndex].selected){
        delete saveUpdateReportCategory.ReportCategoryFields[colIndex].selected;
        cols.push(this.saveUpdateReportCategory.ReportCategoryFields[colIndex]);
      }else{
        delete saveUpdateReportCategory.ReportCategoryFields[colIndex].selected;
      }
    }

    saveUpdateReportCategory.ReportCategoryFields = cols;

    return saveUpdateReportCategory;
  }
  private saveReportCategory() {

    this.reportService.createReportCategories(this.createReportBuild(this.saveUpdateReportCategory)).subscribe((res) => {
      this.toastr.success("Successfully created", "Report Category");
      this.getAllReportCategories(() => {
        this.pageStatus = "list";
      });
    },(err) => {
      if(err.status==400) {
        this.toastr.warning("Report Name Can't be Duplicate", "Report Category");
      }
    });

  }

  private cancelUpdateReportCategory() {
    this.pageStatus = "list";
    this.reportCategory = new ReportCategory();
  }

  private cancelSaveReportCategory() {
    this.pageStatus = "list";
    this.reportCategory = new ReportCategory();
  }

  private confirmation(title: string, msg: string, callback: Function){
    let confirmationInstance: IConfirmation = <IConfirmation>{
      title: title || "Title",
      message: msg || "",
      firstButton: 'Yes',
      secondButton: 'No'
    };
    this.confirmationService.activate(confirmationInstance).then((responseOK) => {
      if (responseOK) {
        callback(true,responseOK);
      }else{
        callback(false,responseOK);
      }
    });
  }

  private resetReportCategory(){
    this.confirmation('Reset Report',`Are you sure you want to reset changes ?`,(status: boolean) => {
      if(status){
        this.reportCategoryInstance.reset()
      }
    });
  }

  private changeView(event, status: string, reportCategory?: ReportCategory){
    switch (status){
      case 'create':
        this.isCloneReport = false;
        this.reportCategory = new ReportCategory();
        this.pageStatus = "create";
        break;
      case 'edit':
        this.confirmation('Warning',`Updating report category will affect related generated reports.Continue ?`,(status: boolean) => {
          if(status){
            this.isCloneReport = false;
            this.reportCategory = reportCategory;
            this.pageStatus = "edit";
          }
        });
        break;
      case 'clone':
        this.isCloneReport = true;
        this.reportCategory = reportCategory;
        this.pageStatus = "clone";
        break;
      case 'delete':
        this.isCloneReport = false;
        this.deleteReportCategory(reportCategory.id, (res) => {});
        break;
      default:
        this.isCloneReport = false;
        this.pageStatus = "list";
        break;
    }
  }

  onReportCategoryChange(event: {instance: ReportCategoryComponent, result: ReportCategory}){
    this.saveUpdateReportCategory = event.result.clone(true);
  }
  onReportSaveActivate(event:{instance: ReportCategoryComponent, result: boolean}){
    this.isReportSaveActivate = event.result;
  }

}
