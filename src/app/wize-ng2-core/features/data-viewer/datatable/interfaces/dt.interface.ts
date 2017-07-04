import { Component, Input, Output, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from '../services/datatable.service';
import { PluralService } from '../../../../core/shared/services';

export abstract class IDataTable  {

  @Input() routes: any;
  @Input() primaryEntity: any;

  addSubscription: Subscription;
  showAddView: boolean = false;

  columnSubscription: Subscription;
  columns: Array<any>;

  importSubscription: Subscription;
  importModel: string;

  exportSubscription: Subscription;
  exportModel: string;

  filterSubscription: Subscription;
  filters: any;

  searchSubscription: Subscription;
  search: any;

  titleFilterSubscription: Subscription;
  titleFilter: any;

  closeAddEditModalSubscription: Subscription;

  entity: any;
  // rows: any[] = [];
  activeColumns: any[] = [];
  allColumns: any[] = [];

  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected dataTableService: DataTableService,
              protected pluralService: PluralService) {
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
        // showmodal for importing data
        this.importData();
      });

    this.exportSubscription = dataTableService.export$.subscribe(
      fileName => {
        // call export API
        this.exportData();
      });

    this.filterSubscription = dataTableService.filter$.subscribe(
      filter => {
        this.filters = filter;
      });

    this.searchSubscription = dataTableService.search$.subscribe(
      search => {
        this.searchData(search);
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

  abstract filterData(orderBy);
  abstract searchData(searchText);
  abstract importData();
  abstract exportData();
  abstract showRow(row: any) ;
  abstract addRecord();
  abstract editRow(row: any);
  abstract deleteRow(row: any);
  abstract onModalClosed(item: any);
  abstract getColumnByUnique(unique: boolean);
}
