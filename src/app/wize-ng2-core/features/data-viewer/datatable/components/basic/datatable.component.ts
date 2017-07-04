import { IDataTable } from '../../interfaces/dt.interface';
import { Component, Input, Output, OnInit, OnChanges, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from '../../services/datatable.service';
import { PluralService } from '../../../../../core/shared/services';

@Component({
  selector: 'dt-simple',
  templateUrl: './datatable.html',
  styleUrls: ['./datatable.scss'],
  providers: []
})

export class BasicDTComponent extends IDataTable implements OnInit{
  rows: any[] = [];
  constructor(protected router: Router,
              protected activatedRoute: ActivatedRoute,
              protected dataTableService: DataTableService,
              protected pluralService: PluralService) {
    super(router, activatedRoute, dataTableService, pluralService);
  }

  filterData(orderBy) {
  }
  searchData(searchText) {
  }
  importData() {
  }
  exportData() {
  }
  showRow(row: any) {
  }
  addRecord() {
  }
  editRow(row: any) {
  }
  deleteRow(row: any) {
  }
  onModalClosed(item: any) {
  }

  ngOnInit () {
    console.log('NG On Init');
    const newRows = [];
    for (let i = 0 ; i < 20 ; i++ ) {
      newRows.push({
        vin : `Vin-${i}`,
        year : `year-${i}`,
        color : `color-${i}`,
        brand : `brand-${i}`,
      });
    }
    this.rows = newRows;
  }
  getColumnByUnique(unique: boolean) {
    return this.activeColumns.filter((c) => {
      return c.unique === unique;
    });
  }
}
