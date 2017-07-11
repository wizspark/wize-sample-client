import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as _ from 'lodash';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';
import {ReportApiService} from "../../../services/reports-api.service";
import { ConfirmationService, IConfirmation } from '../../../shared/index';
import {ReportCategory, ReportCategoryField, ReportRelatedModels} from "../../interfaces/report-category";
import {DynamicHeight} from "../../../services/reports.service";

@Component({
  selector: 'report-category',
  templateUrl: './report-category.html',
  styleUrls: ['report-category.scss']
})
export class ReportCategoryComponent implements OnInit {

  @Input() isClone: boolean;
  @Input() reportCategory: ReportCategory;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSaveActivate: EventEmitter<any> = new EventEmitter<any>();

  isDataLoaded: boolean = false;
  reportName: string = "";
  reportDescription: string = "";
  dbMetaData: any[];
  modelsAndColumns: any[] = [];
  reportCategoryResponse: ReportCategory = new ReportCategory();

  activeState: {
    active: string,
    main:{
      key:string,
      instance: ReportCategory,
      columns: ReportCategoryField[]
    },
    relational:{}
  } = {
    active: "",
    main:{
      key:"",
      instance: null,
      columns: []
    },
    relational:{}
  };
  datatypes: string[] = ["STRING", "TEXT", "INTEGER", "BOOLEAN", "DATE", "WIZE_CODE", "JSONB", "FLOAT", "WIZE_TIME"];
  validDatatypes: string[] = ["STRING", "INTEGER", "BOOLEAN", "DATE", "FLOAT", "ENUM", "WIZE_MONEY"];
  constructor(private reportService: ReportApiService,
              private confirmationService: ConfirmationService,
              private dynamicHeight: DynamicHeight
              /*, private toastr: CoreToastManager*/) {

  }

  ngOnInit() {
    this.reset();
  }

  reset(){

    this.activeState = {
      active: "",
      main:{
        key:"",
        instance: null,
        columns: []
      },
      relational:{}
    };

    this.isClone = this.isClone || false;
    this.isDataLoaded = false;
    if(this.dbMetaData){
      if(this.isClone && this.reportCategory.modelName!=""){
        this.initReport();
      }else if(this.reportCategory.modelName!=""){
        this.initReport();
      }else{
        this.initBlankReport();
      }
      this.isDataLoaded = true;
    }else{
      this.reportService.getMetaData().subscribe((records: any) => {
        this.dbMetaData = records;
        if(this.isClone && this.reportCategory.modelName!=""){
          this.initReport();
        }else if(this.reportCategory.modelName!=""){
          this.initReport();
        }else{
          this.initBlankReport();
        }
        this.isDataLoaded = true;
      });
    }
  }

  private initBlankReport(){
    this.modelsAndColumns = [];
    for (const model of this.dbMetaData) {

      let categoryMdlRelations = [];
      let categoryMdl = new ReportCategory();

      categoryMdl.modelName = model.target;
      categoryMdl.name = model.displayName;
      categoryMdl.description = model.description;

      categoryMdl.ReportCategoryFields = [];

      for(const key in model.schemaDef) {
        let categoryFld = new ReportCategoryField(categoryMdl);

        categoryFld.columnName = key;
        categoryFld.name = (model.schemaDef[key].displayName)?(model.schemaDef[key].displayName):key;
        categoryFld.dataType = model.schemaDef[key].type;
        if(categoryFld.dataType.startsWith("ENUM") || categoryFld.dataType.startsWith("WIZE_MONEY")) {
          categoryFld.dataType = categoryFld.dataType.startsWith("ENUM")?"ENUM":"FLOAT";
        }
        if(this.validDatatypes.indexOf(categoryFld.dataType)!=-1){
          categoryMdl.ReportCategoryFields.push(categoryFld);
        }
      }

      categoryMdl.relatedModels = [];

      if(model.relationships && model.relationships.length > 0) {
        model.relationships.forEach(function(relation) {
          let relationMdl = new ReportRelatedModels();
          relationMdl.modelName = relation.target;
          relationMdl.name = relation.displayName;
          relationMdl.type = relation.type;
          categoryMdl.relatedModels.push(relationMdl);
        });
        //categoryMdl.relatedModels = this.getRelations(categoryMdl.relatedModels, model);
      }

      this.modelsAndColumns.push(categoryMdl);
    }
  }
  private initReport(){
    this.modelsAndColumns = [];
    let relMdlsCols = {};
    let mainMdlsCols = {};
    let isRelFound = null;
    if(this.reportCategory){
      this.reportName = this.reportCategory.name;
      this.reportDescription = this.reportCategory.description;
      for(let reportFieldIndex = 0; reportFieldIndex<this.reportCategory.ReportCategoryFields.length; reportFieldIndex++){
        if(this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName!=this.reportCategory.modelName){
          if(!relMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName]){
            relMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName] = {};
          }
          relMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName][this.reportCategory.ReportCategoryFields[reportFieldIndex].columnName] = {
            id: (!this.isClone)?this.reportCategory.ReportCategoryFields[reportFieldIndex].id: null,
            ReportCategoryId: this.reportCategory.ReportCategoryFields[reportFieldIndex].ReportCategoryId,
            isMeasure: this.reportCategory.ReportCategoryFields[reportFieldIndex].isMeasure || false,
            isDefault: this.reportCategory.ReportCategoryFields[reportFieldIndex].isDefault || false,
            name: this.reportCategory.ReportCategoryFields[reportFieldIndex].name || null,
            description: this.reportCategory.ReportCategoryFields[reportFieldIndex].description || null,
            selected: true
          };
        }else if(this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName==this.reportCategory.modelName){
          if(!mainMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName]){
            mainMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName] = {};
          }
          mainMdlsCols[this.reportCategory.ReportCategoryFields[reportFieldIndex].modelName][this.reportCategory.ReportCategoryFields[reportFieldIndex].columnName] = {
            id: (!this.isClone)?this.reportCategory.ReportCategoryFields[reportFieldIndex].id:null,
            ReportCategoryId: this.reportCategory.ReportCategoryFields[reportFieldIndex].ReportCategoryId,
            isMeasure: this.reportCategory.ReportCategoryFields[reportFieldIndex].isMeasure || false,
            isDefault: this.reportCategory.ReportCategoryFields[reportFieldIndex].isDefault || false,
            name: this.reportCategory.ReportCategoryFields[reportFieldIndex].name || null,
            description: this.reportCategory.ReportCategoryFields[reportFieldIndex].description || null,
            selected: true
          };
        }
      }
    }
    for (const model of this.dbMetaData) {

      let categoryMdlRelations = [];
      let categoryMdl = new ReportCategory();

      categoryMdl.modelName = model.target;
      categoryMdl.name = model.displayName;
      categoryMdl.description = model.description;

      categoryMdl.ReportCategoryFields = [];

      for(const key in model.schemaDef) {
        let categoryFld = new ReportCategoryField(categoryMdl);

        categoryFld.columnName = key;
        categoryFld.name = (model.schemaDef[key].displayName)?(model.schemaDef[key].displayName):key;
        categoryFld.dataType = model.schemaDef[key].type;

        if(relMdlsCols[categoryMdl.modelName]){
          if(relMdlsCols[categoryMdl.modelName][categoryFld.columnName]){
            let relCol = relMdlsCols[categoryMdl.modelName][categoryFld.columnName];
            if(!this.isClone) {
              categoryFld.id = relCol.id;
            }
            categoryFld.name = relCol.name || categoryFld.name;
            categoryFld.description = relCol.description || categoryFld.description;
            categoryFld.ReportCategoryId = relCol.ReportCategoryId;
            categoryFld.isMeasure = relCol.isMeasure;
            categoryFld.isDefault = relCol.isDefault;
            categoryFld.selected = true;
          }
        }else if(mainMdlsCols[categoryMdl.modelName]){
          if(mainMdlsCols[categoryMdl.modelName][categoryFld.columnName]){
            let mainCol = mainMdlsCols[categoryMdl.modelName][categoryFld.columnName];
            if(!this.isClone) {
              categoryFld.id = mainCol.id;
              categoryFld.ReportCategoryId = mainCol.ReportCategoryId;
            }
            categoryFld.name = mainCol.name || categoryFld.name;
            categoryFld.description = mainCol.description || categoryFld.description;
            categoryFld.isMeasure = mainCol.isMeasure;
            categoryFld.isDefault = mainCol.isDefault;
            categoryFld.selected = true;
          }
        }
        if(this.validDatatypes.indexOf(categoryFld.dataType)!=-1){
          categoryMdl.ReportCategoryFields.push(categoryFld);
        }
      }

      categoryMdl.relatedModels = [];

      if(model.relationships && model.relationships.length > 0) {
        model.relationships.forEach(function(relation) {
          let relationMdl = new ReportRelatedModels();
          relationMdl.modelName = relation.target;
          relationMdl.name = relation.displayName;
          relationMdl.type = relation.type;
          categoryMdl.relatedModels.push(relationMdl);
        });
        //categoryMdl.relatedModels = this.getRelations(categoryMdl.relatedModels, model);

      }

      if(mainMdlsCols[categoryMdl.modelName] && !relMdlsCols[categoryMdl.modelName]){
        if(!this.isClone) {
          categoryMdl.id = this.reportCategory.id;
        }
        categoryMdl.selected = true;
        this.activeState.active = categoryMdl.modelName;
        this.activeState.main.instance = categoryMdl;
        this.activeState.main.key = categoryMdl.modelName;
        for(let mainColIndex = 0; mainColIndex<categoryMdl.ReportCategoryFields.length; mainColIndex++){
          if(categoryMdl.ReportCategoryFields[mainColIndex].selected){
            this.activeState.main.columns.push(categoryMdl.ReportCategoryFields[mainColIndex]);
          }
        }
        categoryMdl.relatedModels.forEach((relmdl) => {
          if(!this.activeState.relational[relmdl.modelName]){
            this.activeState.relational[relmdl.modelName] = {
              instance: {},
              columns:[]
            };
          }
        });
      }else if(!mainMdlsCols[categoryMdl.modelName] && relMdlsCols[categoryMdl.modelName]){
        this.activeState.relational[categoryMdl.modelName] = {
          instance: categoryMdl,
          columns:[]
        };
        for(let relColIndex = 0; relColIndex<categoryMdl.ReportCategoryFields.length; relColIndex++){
          if(categoryMdl.ReportCategoryFields[relColIndex].selected){
            this.activeState.relational[categoryMdl.modelName].columns.push(categoryMdl.ReportCategoryFields[relColIndex]);
          }
        }
      }

      this.modelsAndColumns.push(categoryMdl);
    }
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName;
      this.reportCategoryResponse.description = this.reportDescription;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});

      if(this.onSaveActivate){
        this.onSaveActivate.emit({result:((this.activeState.main.columns.length)>0?true:false),instance:this});
      }
    }
  }

  expandState(event, state){
    /*if(this.activeState.main.key == state.modelName || (this.activeState.relational[state.modelName])){
      if(this.activeState.main.columns.length==0){
        this.activeState.main.key = state.modelName;
        this.activeState.main.instance = state;
        this.activeState.main.columns = [];
        if(state.relatedModels){
          this.activeState.relational = {};
          for(let relModalsIndex = 0; relModalsIndex<state.relatedModels.length; relModalsIndex++){
            this.activeState.relational[state.relatedModels[relModalsIndex].name] = {
              instance: {},
              columns: []
            };
          }
        }else{
          this.activeState.relational = {};
        }
      }
      this.activeState.active = state.modelName;
    }else{
      this.activeState.active = state.modelName;
    }*/

    if(this.activeState.main.key==''){
      this.activeState.main.key = state.modelName;
      this.activeState.main.instance = state;
      this.activeState.main.columns = [];
      if(state.relatedModels){
        this.activeState.relational = {};
        for(let relModalsIndex = 0; relModalsIndex<state.relatedModels.length; relModalsIndex++){
          this.activeState.relational[state.relatedModels[relModalsIndex].name] = {
            instance: {},
            columns: []
          };
        }
      }else{
        this.activeState.relational = {};
      }
      this.activeState.active = state.modelName;
    }else if((this.activeState.main.key==state.modelName && this.activeState.main.columns.length>0) || this.activeState.relational[state.modelName]){
      this.activeState.active = state.modelName;
    }else if(this.activeState.main.key!=state.modelName && !this.activeState.relational[state.modelName] && this.activeState.main.columns.length==0){
      this.activeState.main.key = state.modelName;
      this.activeState.main.instance = state;
      this.activeState.main.columns = [];
      if(state.relatedModels){
        this.activeState.relational = {};
        for(let relModalsIndex = 0; relModalsIndex<state.relatedModels.length; relModalsIndex++){
          this.activeState.relational[state.relatedModels[relModalsIndex].name] = {
            instance: {},
            columns: []
          };
        }
      }else{
        this.activeState.relational = {};
      }
      this.activeState.active = state.modelName;
    }
  }
  collapseState(event, state){
    this.activeState.active = "";
    if(state.modelName==this.activeState.main.key && this.activeState.main.columns.length==0){
      this.activeState.main.key = "";
      this.activeState.relational = {};
    }
  }

  emitOnChange(){
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
      this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});

      if(this.onSaveActivate){
        this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
      }
    }

  }

  mainModalColSelected(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){
    this.activeState.main.columns = [];
    for(let colIndex = 0; colIndex<modal.ReportCategoryFields.length; colIndex++){
      if(modal.ReportCategoryFields[colIndex].selected) {
        this.activeState.main.columns.push(modal.ReportCategoryFields[colIndex]);
      }
    }
    this.activeState.main.instance = modal;
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
      this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});

      if(this.onSaveActivate){
        this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
      }
    }


  }
  mainModalColNotSelectedConfirmation(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){
    if(this.activeState.main.columns.length==1){
      this.confirmation('Updation',`All related Models status will also change`,(status: boolean) => {
        if(status){
          let lastFieldUpdated: {index: string, reportField: ReportCategoryField} = {
            index: null,
            reportField: field.clone()
          };
          for(let colIndex = 0; colIndex<this.activeState.main.columns.length; colIndex++){
            if(this.activeState.main.columns[colIndex].name==field.name) {
              lastFieldUpdated.index = (colIndex+"");
              field.isMeasure = false;
              field.isDefault = false;
              this.activeState.main.columns.splice(colIndex,1);
              break;
            }
          }
          if(this.activeState.main.columns.length==0){
            let relationalMdls = modal.relatedModels.map((relMdl) => {
              return relMdl.name;
            });
            for(let mdlIndex = 0; mdlIndex < this.modelsAndColumns.length; mdlIndex++){
              if(relationalMdls.indexOf(this.modelsAndColumns[mdlIndex].name)!=-1){
                for(let relMdlColIndex = 0; relMdlColIndex < this.modelsAndColumns[mdlIndex].ReportCategoryFields.length; relMdlColIndex++ ){
                  this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].selected = false;
                  this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].isMeasure = false;
                  this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].isDefault = false;
                }
              }
            }
          }
          this.activeState.main.instance = modal;
          if(this.onChange){
            this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
            this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
            this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
            for(let relMdl in this.activeState.relational){
              for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
                this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
              }
            }
            this.onChange.emit({result:this.reportCategoryResponse,instance:this});

            if(this.onSaveActivate){
              this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
            }
          }
        }else{
          field.selected = true;
        }
      });
    }
  }
  mainModalColNotSelected(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){
    if(this.activeState.main.columns.length==1){
      this.mainModalColNotSelectedConfirmation(event, eventName, modal, field, isRelational);
    }else{

        let lastFieldUpdated: {index: string, reportField: ReportCategoryField} = {
          index: null,
          reportField: field.clone()
        };
        for(let colIndex = 0; colIndex<this.activeState.main.columns.length; colIndex++){
          if(this.activeState.main.columns[colIndex].name==field.name) {
            lastFieldUpdated.index = (colIndex+"");
            field.isMeasure = false;
            field.isDefault = false;
            this.activeState.main.columns.splice(colIndex,1);
            break;
          }
        }
        if(this.activeState.main.columns.length==0){
          let relationalMdls = modal.relatedModels.map((relMdl) => {
            return relMdl.name;
          });
          for(let mdlIndex = 0; mdlIndex < this.modelsAndColumns.length; mdlIndex++){
            if(relationalMdls.indexOf(this.modelsAndColumns[mdlIndex].name)!=-1){
              for(let relMdlColIndex = 0; relMdlColIndex < this.modelsAndColumns[mdlIndex].ReportCategoryFields.length; relMdlColIndex++ ){
                this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].selected = false;
                this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].isMeasure = false;
                this.modelsAndColumns[mdlIndex].ReportCategoryFields[relMdlColIndex].isDefault = false;
              }
            }
          }
        }
        this.activeState.main.instance = modal;
        if(this.onChange){
          this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
          this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
          this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
          for(let relMdl in this.activeState.relational){
            for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
              this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
            }
          }
          this.onChange.emit({result:this.reportCategoryResponse,instance:this});

          if(this.onSaveActivate){
            this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
          }
        }
    }

  }

  relationalModalColSelected(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){
    this.activeState.relational[modal.name] = {
      instance: {},
      columns: []
    };
    for(let colIndex = 0; colIndex<modal.ReportCategoryFields.length; colIndex++){
      if(modal.ReportCategoryFields[colIndex].selected) {
        this.activeState.relational[modal.name].columns.push(modal.ReportCategoryFields[colIndex]);
      }
    }
    this.activeState.relational[modal.name].instance = modal;
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
      this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});

      if(this.onSaveActivate){
        this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
      }
    }
  }

  relationalModalColNotSelected(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){

    for(let colIndex = 0; colIndex<this.activeState.relational[modal.name].columns.length; colIndex++){
      if(field.name==this.activeState.relational[modal.name].columns[colIndex].name) {
        field.isMeasure = false;
        field.isDefault = false;
        this.activeState.relational[modal.name].columns.splice(colIndex,1);
        this.activeState.relational[modal.name].instance = modal;
        break;
      }
    }
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
      this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});if(this.onSaveActivate){
        this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
      }
    }
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

  changeReportFieldNameAndDesc(event, modal, field, isRelational){
    this.changeReportNameAndDesc(event);
  }

  changeReportNameAndDesc(event){
    if(this.onChange){
      this.reportCategoryResponse = this.activeState.main.columns.length>0?this.activeState.main.instance.clone(true):new ReportCategory();
      this.reportCategoryResponse.name = this.reportName || this.reportCategoryResponse.name;
      this.reportCategoryResponse.description = this.reportDescription || this.reportCategoryResponse.description;
      for(let relMdl in this.activeState.relational){
        for(let relColsIndex = 0; relColsIndex<this.activeState.relational[relMdl].columns.length; relColsIndex++){
          this.reportCategoryResponse.ReportCategoryFields.push(this.activeState.relational[relMdl].columns[relColsIndex]);
        }
      }
      this.onChange.emit({result:this.reportCategoryResponse,instance:this});

      if(this.onSaveActivate){
        this.onSaveActivate.emit({result:this.activeState.main.columns.length>0?true:false,instance:this});
      }
    }
  }

  changeModalStatusMap(event, eventName, modal: ReportCategory, field: ReportCategoryField, isRelational?: boolean){
    event.preventDefault();
    if(!isRelational){
      if(field.selected){
        this.mainModalColSelected(event, eventName, modal, field);
      }else{
        this.mainModalColNotSelected(event, eventName, modal, field);
      }
    }else{
      if(field.selected){
        this.relationalModalColSelected(event, eventName, modal, field);
      }else{
        this.relationalModalColNotSelected(event, eventName, modal, field);
      }
    }
  }

  getRelations(relatedModels: any[], model: any) {
    if(model.relationships && model.relationships.length > 0) {
      let instance = this;
      model.relationships.forEach(function(relation) {
        if(!relatedModels.find(model => model.modelName == relation.target)) {
          let relationMdl = new ReportRelatedModels();
          relationMdl.modelName = relation.target;
          relationMdl.name = relation.displayName;
          relationMdl.type = relation.type;
          relatedModels.push(relationMdl);
          for(const relatedModel of instance.dbMetaData) {
            if(relatedModel.target == relation.target) {
              relatedModels = instance.getRelations(relatedModels, relatedModel);
            }
          }
        }
      });
    }
    return relatedModels;
  }

}
