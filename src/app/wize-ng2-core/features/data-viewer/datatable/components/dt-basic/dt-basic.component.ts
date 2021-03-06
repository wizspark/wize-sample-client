import {
  Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter, QueryList,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { IOptions, ILazyLoadEvent, IDataTableInputConfig, DataTableInputConfig } from '../../interfaces/index';
import { DataTableService } from '../../services/datatable.service';
import { PluralService } from '../../../../../core/shared/services/index';
import { PrimeTemplate } from 'primeng/components/common/shared';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';
import { RuleBuilderComponent } from '../../../../rule-builder/components/rule-builder/rule-builder.component';
import { ConfirmationService, IConfirmation } from '../../../shared/index';
@Component({
  selector: 'dt-basic',
  templateUrl: './dt-basic.html',
  styleUrls: ['./dt-basic.scss'],
  providers: []
})

export class BasicDataTableComponent implements OnChanges, OnDestroy {
  @ViewChild('ruleBuilder') ruleBuilderModal:RuleBuilderComponent;

  @Input() dataTableInputConfig:IDataTableInputConfig;
  @Input() templates:QueryList<PrimeTemplate>;
  @Output() associationDataUpdated:EventEmitter<any> = new EventEmitter();
  primaryEntity:any;
  totalRecords:number = 0;
  paginator:boolean = true;
  pageLinks:number = 3;
  rowsPerPageOptions:Array<Number> = [5, 10, 20];
  limit:number = 15;
  addSubscription:Subscription;
  showAddView:boolean = false;

  columnSubscription:Subscription;
  columns:Array<any>;

  importSubscription:Subscription;
  importModel:string;

  exportSubscription:Subscription;
  exportModel:string;

  filterSubscription:Subscription;
  filters:any;

  searchSubscription:Subscription;
  search:any;

  titleFilterSubscription:Subscription;
  titleFilter:any;

  closeAddEditModalSubscription:Subscription;

  entity:any;
  rows:any[] = [];
  activeColumns:any[] = [];
  allColumns:any[] = [];
  route:any;
  id:number;
  routeData:any;
  // primaryEntity: any;
  showAddModal:boolean = false;
  editColumns:Array<any> = [];

  associatedRows:any;
  selectedRecords:any = [];
  actions: any = [];

  constructor(protected router:Router,
              protected activatedRoute:ActivatedRoute,
              protected dataTableService:DataTableService,
              protected pluralService:PluralService,
              private toastr:CoreToastManager, private confirmationService:ConfirmationService) {
    this.addSubscription = dataTableService.add$.subscribe(
      item => {
        this.showAddView = true;
      });

    this.columnSubscription = dataTableService.column$.subscribe(
      columns => {
        this.columns = columns;
      });

    this.importSubscription = dataTableService.import$.subscribe(
      fileName => {
        this.importData();
      });

    this.exportSubscription = dataTableService.export$.subscribe(
      fileName => {
        this.exportData();
      });

    this.filterSubscription = dataTableService.filter$.subscribe(
      filter => {
        this.filters = filter;
      });

    this.searchSubscription = dataTableService.search$.subscribe(
      search => {

      });

    this.titleFilterSubscription = dataTableService.titleFilter$.subscribe(
      filter => {
        this.filterData(filter);
      });

    this.closeAddEditModalSubscription = dataTableService.closeAddEditModal$.subscribe(
      item => {
        this.onModalClosed(item);
      });
  }

  //Entity Global Filters by

  filterData(orderBy) {
    let event = {
      first: 0,
      rows: 10,
      sortField: orderBy.name,
      sortOrder: orderBy.sortOrder
    }
    this.getModelData(event);
  }

  searchRecords(searchText) {
    let searchColumns:Array<any> = this.activeColumns.filter((col) => {
      return col.type === "STRING" || col.type === 'TEXT'
    });
    let query = {
      "$or": []
    };
    for (let c of searchColumns) {
      let cq = {};
      cq[c.name] = {$ilike: `%${searchText}%`};
      query["$or"].push(cq);
    }

    let event = {
      first: 0,
      rows: this.limit,
      query: query
    }
    this.getModelData(event);
  }

  addRow(options) {
    this.addRecord();
  }

  importData() {
    this.dataTableService.showImportDataModal({
      entityName: this.entity.name,
      title: 'Import Data',
      row: {}
    });
  }

  exportData() {
    this.dataTableService.exportData(this.pluralService.pluralize(this.primaryEntity.name));
  }

  showRow(row:any) {
    if (this.dataTableInputConfig.isHeader) {
      this.router.navigate(['wize/page', this.routeData.route, row.id]);
    }
    else {
      this.viewRecord(row);
    }
  }

  viewRecord(row) {
    //this.showAddModal = true;
    this.showAddModal = true;
    this.editColumns = this.dataTableService.getColumnsWithValue(this.allColumns, row, true);
    this.dataTableService.showViewDetails({
      entity: this.entity,
      target: this.entity.name,
      title: `View Detail`,
      mode: "form",
      row: row,
      edit: true,
      routes: this.dataTableInputConfig.routes,
      customFormData: {attributes: this.editColumns, settings: {}}
    });
  }

  addRecord() {
    this.showAddModal = true;
    this.editColumns = this.dataTableService.getColumnsWithValue(this.allColumns, null, false);
    this.dataTableService.showAddEditModal({
      entity: this.entity,
      target: this.entity.name,
      title: `Add Record`,
      mode: "form",
      row: {},
      edit: false,
      routes: this.dataTableInputConfig.routes,
      customFormData: {attributes: this.editColumns, settings: {}}
    });
  }

  editRow(row:any) {
    //TODO - Navigating to detail row
    this.showAddModal = true;
    this.editColumns = this.dataTableService.getColumnsWithValue(this.allColumns, row, true);
    this.dataTableService.showAddEditModal({
      entity: this.entity,
      target: this.entity.name,
      title: `Edit Record`,
      mode: "form",
      row: row,
      edit: true,
      routes: this.dataTableInputConfig.routes,
      customFormData: {attributes: this.editColumns, settings: {}}
    });
  }

  deleteRow(row:any) {
    let deleteConfirmation:IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this record ?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        if (this.dataTableInputConfig.belongsToMany) {
          let index = this.rows.indexOf(row, 0);
          if (index > -1) {
            this.rows.splice(index, 1);
          }
          const path = this.dataTableService.getAPIPath(this.primaryEntity, this.entity, 'delete', this.id, false, true);
          this.dataTableService.deleteRow(path, this.rows, true).subscribe((data) => {
            let event = {
              first: 0,
              rows: this.limit,
              sortField: null,
              sortOrder: null
            };
            this.getModelData(event);
            this.toastr.success('Successfully deleted record.', 'Sucess');
          });
        }
        else {
          const path = this.dataTableService.getAPIPath(this.primaryEntity, this.entity, 'delete', this.id, false, false);
          this.dataTableService.deleteRow(path, row, false).subscribe((data) => {
            this.toastr.success('Successfully deleted record.', 'Sucess');
            let event = {
              first: 0,
              rows: this.limit,
              sortField: null,
              sortOrder: null
            };
            this.getModelData(event);

          });
        }
      }
    });
  }

  refreshModel(event) {
    if (event.name === this.entity.name) {

      let event = {
        first: 0,
        rows: this.limit,
        sortField: null,
        sortOrder: null
      };
      this.getModelData(event);
    }
  }

  applyFilter(query) {
    let event = {
      first: 0,
      rows: this.limit,
      query: query
    };
    this.getModelData(event);
  }

  showFilterModal(data:any) {
    this.editColumns = this.dataTableService.getColumnsWithValue(this.allColumns, null, false);
    this.dataTableService.showFilterModal({
      entityName: this.entity.name,
      title: 'Filter',
      row: data,
      customFormData: {attributes: this.editColumns, settings: {}}
    });
  }

  ngOnChanges() {
    this.rows = [];
    this.route = this.activatedRoute.snapshot.params['route'];
    this.id = this.activatedRoute.snapshot.params['id'];
    this.routeData = this.dataTableInputConfig.routes.find((route) => route.route === this.route || route.routeId === this.route);
    this.primaryEntity = this.routeData.entities.find((entity) => {
      return entity['primary'] === true
    });
    this.entity = this.routeData.entities.find((entity) => {
      return entity.name === this.dataTableInputConfig.entityName
    });
    this.getColumns();
    this.associatedRows = null;
    if(this.routeData.actions.customActions){
      this.actions = this.routeData.actions.customActions.filter((action) => action.layout === 'RECORD');
    }
    // Commented because of lazy load calling the service
    //this.getModelData(null);
  }

  ngOnDestroy() {
    this.addSubscription.unsubscribe();
    this.columnSubscription.unsubscribe();
    this.importSubscription.unsubscribe();
    this.exportSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.searchSubscription.unsubscribe();
    this.closeAddEditModalSubscription.unsubscribe();
  }

  getColumns() {
    this.activeColumns = this.dataTableService.getColumns(this.entity, true);
    this.allColumns = this.dataTableService.getColumns(this.entity);
  }

  getModelData(event) {
    let modelApiName:string = this.pluralService.pluralize(this.dataTableInputConfig.entityName);
    let association:Array<any> = null;
    let path:string;
    if (this.primaryEntity.name !== this.dataTableInputConfig.entityName) {
      path = this.dataTableService.getAPIPath(this.primaryEntity, this.entity, 'get', this.id, this.dataTableInputConfig.isAssociation);
      this.dataTableService.getRows(path, event.query, this.entity.apis.association, null, null, event.sortField, event.sortOrder).subscribe((data) => {
        //this.rows = data[this.pluralService.pluralize(this.dataTableInputConfig.entityName)];
        if (this.dataTableInputConfig.isAssociation) {
          this.rows = data.rows;
          this.totalRecords = data.count;
          const associatedPath = path = this.dataTableService.getAPIPath(this.primaryEntity, this.entity, 'get', this.id, false);
          if (!this.associatedRows) {
            this.dataTableService.getRows(associatedPath, event.query, this.entity.apis.association, null, null, event.sortField, event.sortOrder).subscribe((data) => {
              this.associatedRows = this.selectedRecords = data.rows;
              this.associationDataUpdated.emit(data.rows);
            });
          }
        }
        else {
          this.rows = data.rows;
          this.totalRecords = data.count;
        }
        //this.updatePagination();
        this.paginator = false;
      }, (err) => {
        this.handleError(err);
        this.updatePagination();
      });
    }
    else {
      path = this.dataTableService.getAPIPath(this.primaryEntity, this.entity, 'get', this.id, false);
      this.dataTableService.getRows(path, event.query, this.entity.apis.association, null, null, event.sortField, event.sortOrder).subscribe((data) => {
        this.rows = data.rows || [];
        this.totalRecords = data.count;
        //this.updatePagination();
        this.paginator = false;
      }, (err) => {
        this.handleError(err);
        this.updatePagination();
      });
    }
  }

  handleError(err) {
    //localStorage.removeItem('authLoginData');
    if (err.status === 401)
      this.router.navigate(['login'])
  }

  updatePagination() {
    if (this.totalRecords && this.totalRecords > this.limit) {
      this.paginator = true;
    }
    else {
      this.paginator = false;
    }
  }

  updateColumn(field, event) {
    this.allColumns.find((c) => {
      return c.name === field
    }).isActive = event.currentTarget.checked;
  }

  resetColumns() {
    this.activeColumns = this.activeColumns.filter((item) => {
      return item.noView === false
    });
    this.allColumns.forEach((item) => {
      item.viewOptions.noView = item.noView;
    });
  }

  updateColumns(columns) {
    this.activeColumns = columns;
  }

  onModalClosed(data:any) {
    this.showAddModal = false;
  }

  getColumnByUnique(unique:boolean) {
    return this.activeColumns.filter((c) => {
      return c.viewOptions.noUnique === !unique;
    });
  }

  // Association

  checkRecordAssociated(row) {
    if (this.associatedRows) {
      const record = this.associatedRows.find((r) => {
        return r.id === row.id
      })
      if (record && !this.selectedRecords.find((r) => {
          return r.id === record.id
        })) {
        this.selectedRecords.push(record);
      }
      return record ? true : false;
    }
    return false;
  }

  updateSelectedRecord(row, event) {
    const record = this.selectedRecords.find((r) => {
      return r.id === row.id
    })
    if (event.currentTarget.checked) {
      if (record) {
        let index = this.selectedRecords.indexOf(row, 0);
        if (index > -1) {
          this.selectedRecords.splice(index, 1);
        }
      }
      else {
        this.selectedRecords.push(row);
      }
    }
    else {
      let index = this.selectedRecords.indexOf(record, 0);
      if (index > -1) {
        this.selectedRecords.splice(index, 1);
      }
    }
    this.associationDataUpdated.emit(this.selectedRecords);
  }

  getElementWidth(data) {
    if (data && data.length > 0) {
      let widthValue:string = '';
      switch (data.length) {
        case 30:
          widthValue = "120px";
          break;
        case 40:
          widthValue = "140px";
          break;
        case 50:
          widthValue = "160px";
          break;
        case 60:
          widthValue = "180px";
          break;
        case 70:
          widthValue = "200px";
          break;
        case 80:
          widthValue = "220px";
          break;
        case 100:
          widthValue = "240px";
          break;
        case 110:
          widthValue = "260px";
          break;
        case 120:
          widthValue = "280px";
          break;
        default:
          widthValue = "120px";
          break
      }

      return widthValue;
    }
    else {
      return "auto";
    }
  }

  showRuleEditor(row:any, ruleColumn:string) {
    let rule = row[ruleColumn];
    this.ruleBuilderModal.activate(rule).then((updatedRule:string) => {
      row[ruleColumn] = updatedRule;
      this.dataTableService.updateRow(this.entity.apis.patch, row.id, row).subscribe((data) => {
        this.toastr.success('Successfully updated record', 'Success');
      });
    });
  }

  getStyle(colName) {
    if (colName === 'title') {
      return {'width': '180px'};
    }
    return "";
  }

  /**
   * Run Model Rules
   */
  runRules() {
    this.dataTableService.runRules(null, null).subscribe((data) => {
      //Console.log('');
    });
  }

  showRuleInput() {
    this.dataTableService.showRuleModal({
      primaryEntity: this.entity,
      entity: this.entity,
      target: this.entity.name,
      title: `Run Rules`,
      mode: "form",
      row: {},
      routes: this.dataTableInputConfig.routes,
      executionData: this.formatExecutionData(this.rows),
      customFormData: {
        attributes: this.entity.factSchema.attributes,
        settings: {}
      }
    });
  }

  formatExecutionData(data) {
    let executionData = [];
    data.forEach((row) => {
      const item = {
        id: row.id,
        name: row.ruleName,
        condition: row.ruleCondition,
        consequence: row.ruleConsequence
      }
      executionData.push(item)
    });
    return executionData;
  }

  executeCustomAction(action: any, row: any){
    try {
      const apiPath = this.parseAPIPath(action, row);
      this.dataTableService.executeCustomAction(action.api.method, apiPath, row).subscribe((data) => {
        this.toastr.success(`Successfully executed ${action.name} action.`, 'Success');
        this.refreshModel(this.entity);
      }, err => this.toastr.error(`Something went wrong while executing ${action.name} action.`, 'Success'))
    }
    catch (e){
      this.toastr.error(`Something went wrong while executing ${action.name} action.`, 'Success');
    }
  }

  parseAPIPath(action:any, row: any){
    let path = action.api.path;
    action.parameters.forEach((p)=>{
      path = path.replace(`:${p.param}`, row[p.attribute]);
    });
    return path;
  }
}

