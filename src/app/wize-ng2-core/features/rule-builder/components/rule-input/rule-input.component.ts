import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterBuilderService } from '../../services/filter-builder.service';
import { RuleBuilderService } from '../../services/rule-builder.service';
import { RuleGroup, RuleField } from '../../interfaces/rule-builder.interface';
import { ModalComponent } from '../../../modal/modal.component';

@Component({
  selector: 'rule-input-control',
  templateUrl: 'rule-input.html',
  providers: [
    FilterBuilderService,
    { provide: RuleBuilderService, useClass: FilterBuilderService }
  ]
})
export class RuleInputControlComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  @Input() filterModel: any;
  @Input() fields: RuleField[];

  @Output() filterModelChange = new EventEmitter<any>();

  group: RuleGroup;
  query: any;
  constructor(private filterBuilderService: FilterBuilderService) {
  }

  ngOnInit() {
    this.group = <RuleGroup>{ operator: this.filterBuilderService.getGroupOperators()[0], rules: [] };
    // this.fields = [
    //   {field: 'a', label: 'a', type: 'STRING'},
    //   {field: 'b', label: 'b', type: 'INTEGER'},
    //   {field: 'c', label: 'c', type: 'BOOLEAN'},
    //   {field: 'd', label: 'd', type: 'DATE'},
    //   {field: 'e', label: 'e', type: 'WIZE_CODE'},
    //   {field: 'f', label: 'f', type: 'id'},
    // ];
  }

  ngOnChanges() {
    if (this.filterModel && this.fields) {
      this.group = this.filterBuilderService.readFilterQuery(this.filterModel, this.fields);
      this.query = this.filterBuilderService.generateFilterQuery(this.group);
    }
  }

  activate() {
    this.modal.show();
  }

  save() {
    let query = this.filterBuilderService.generateFilterQuery(this.group);
    console.log(query);
    this.filterModelChange.emit(query);
    this.dismissed();
  }

  dismissed() {
    this.modal.hide();
  }
}
