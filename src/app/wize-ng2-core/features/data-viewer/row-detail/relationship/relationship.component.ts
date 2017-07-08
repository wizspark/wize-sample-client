import { Component, Input, Output, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { IOptions , ILazyLoadEvent, DataTableInputConfig, IDataTableInputConfig} from '../../datatable/interfaces/datatable.interface';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from '../../datatable/services/datatable.service';
import { PluralService } from '../../../../../wize-ng2-core/core/shared/services/pluralize.service';
import { UIConfigService } from '../../../../../wize-ng2-core/core/shared/services/index';

@Component({
  selector: 'relationship',
  templateUrl: './relationship.html',
  styleUrls: ['./relationship.scss'],
  providers: []
})
export class RelationshipComponent implements OnInit {
  @Input() dataTableInputConfig:any;
  @Input() relationship:any;
  config:IDataTableInputConfig;
  @ViewChild('tableView') public tableView:any;

  constructor() {
  }

  ngOnInit() {
    this.config = new DataTableInputConfig(
      this.dataTableInputConfig.routes,
      this.relationship.target,
      this.dataTableInputConfig.isHeader,
      this.dataTableInputConfig.isSelection,
      this.dataTableInputConfig.headerOptions,
      false,
      this.relationship.type === 'belongsToMany' ? true : false
    );
  }
}
