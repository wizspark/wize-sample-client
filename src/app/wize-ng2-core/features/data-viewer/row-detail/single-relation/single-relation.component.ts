import { Component, OnInit, Input } from '@angular/core';
import { PluralService } from '../../../../core/shared/services/pluralize.service'
import { DataTableService } from "../../datatable/services/datatable.service";

@Component({
  selector: 'single-relationship',
  templateUrl: 'single-relation.component.html',
  styleUrls: ['single-relation.component.scss']
})
export class SingleRelationshipComponent implements OnInit {
  @Input() entityName:any;
  @Input() primaryEntityName:any;
  @Input() id:any;
  @Input() routes:any;
  entity:any;
  rowData:any;
  apiPath:any;
  columns:any;

  constructor(private dataTableService:DataTableService, private pluralService:PluralService) {
  }

  ngOnInit() {
    //debugger;
    this.entity = this.routes.entities.find((e) => e.name === this.entityName);
    const apiPath = `/api/${this.pluralService.pluralize(this.primaryEntityName)}/${this.id}/get${this.pluralService.singularize(this.entityName)}`;
    this.getRowDetail(apiPath);
  }

  getColumns() {
    this.columns = this.dataTableService.getColumns(this.entity);
  }

  getRowDetail(path:string) {
    this.dataTableService.getSingleRelationshipDetail(path).subscribe((data) => {
      this.rowData = data;
    });
  }
}
