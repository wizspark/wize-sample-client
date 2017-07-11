import {Component, OnInit} from '@angular/core';
import {AuditApiService} from '../services/audit-api.service';
import * as moment from 'moment';

const sortBy = require('lodash/sortBy');

@Component({
  selector: 'audit',
  templateUrl: './audit.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
  private records: any[];
  private uniqueColumns: Object = {
    // 'ProductFamily': ['family'],
    // 'Adjuster': ['name'],
    // 'AdjusterOption': ['qualification'],
    // 'AutoAdjuster': ['qualification'],
    // 'HardStopGuideline': ['eligibility'],
    // 'Product': ['code'],
    // 'RateMaster': ['product'],
    // 'Role': ['name'],
    // 'SchemaRole': ['schemaId'],
    // 'SoftStopGuideline': ['eligibility'],
    // 'SoftStopGuidelineType': ['type'],
    // 'UserRole': ['userId']
  };
  private models: any[] = [];
  private displayModels: any = [];
  private query: {'createdAt': 'desc'};
  private selectedModel: any;
  private fromDate: any = moment().startOf('day').add(-180, 'd');
  private toDate: any = moment().endOf('day');
  constructor(private auditApiService: AuditApiService) {

  }

  ngOnInit() {
    this.getVersionedModels();
    this.getAuditHistoryWithSchema(true, null);
  }

  private getAuditHistoryWithSchema(hasSchema: boolean, model?: string) {
    this.getAuditHistory(this.fromDate, this.toDate, hasSchema, model);
  }

  private getAuditHistory(fromDate: any, toDate: any, hasSchema: boolean, model?: any) {
    this.auditApiService.getAuditHistory(model, fromDate, toDate, this.query)
      .subscribe((data: Array<any>) => this.populateData(data, hasSchema));
  }

  private getVersionedModels() {
    this.auditApiService.getVersionedModels()
      .subscribe((data: Array<any>) => this.populateVersionedModels(data));
  }

  private populateVersionedModels(data) {
    let obj = {};
    data.rows.forEach((row) => {
      obj[row.modelName] = [];
      obj[row.modelName].push(row.displayField);
    });
    this.uniqueColumns = obj;
    data.rows.forEach((item) => {
      this.displayModels.push({id: item.modelName, text: item.modelName});
    });
  }

  private populateData(data, hasSchema) {
    let historyData = [];
    let self = this;
    data.rows.forEach((item) => {
      if (hasSchema) {
        self.models.push({id: item.model, name: item.model});
      }
      if (item) {
        let uniqueColumn = {'name': 'id'};
        let columns = {};
        for (let idx in item.properties) { // tslint:disable-line
          let col = item.properties[idx];
          if (col.unique) {
            uniqueColumn = col;
          }
          columns[idx] = col.displayName;
        }
        item.uniqueColumn = uniqueColumn;
        item.columnsList = columns;
        item.createdAt = Date.parse(item.createdAt);
          try {
            item.diff = item.diff;
            item.oldValue = item.oldValue;
          } catch (e) {
            console.log('Audit History: Error while parsing JSON');
          }
          historyData.push(item);
      }
    });
    this.records = sortBy(historyData, 'createdAt').reverse();
  }

  private getRecordIdentifier(record) {
    if (record.oldValue) {
      let field = this.uniqueColumns[record.model] ? this.uniqueColumns[record.model][0] : 'id';
      return record.oldValue[field];
    }
    return record.identifier;
  }

  private onDateRangeChange({from, to}) {
    this.fromDate = from;
    this.toDate = to;
    if(this.selectedModel) {
      this.getAuditHistoryWithSchema(false, this.selectedModel.text);
    } else {
      this.getAuditHistoryWithSchema(false);
    }

  }

  private refreshValue(value:any):void {
    this.selectedModel = value;
    this.getAuditHistoryWithSchema(false, this.selectedModel.text);
  }

}
