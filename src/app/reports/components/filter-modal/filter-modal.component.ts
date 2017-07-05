import { Component, ViewChild, ElementRef, OnInit, Input, Output, AfterContentInit, EventEmitter, OnDestroy  } from '@angular/core';
import { ModalComponent } from '../../../wize-ng2-core/features/modal/modal.component';
import { FilterGroup, ConditionGroup} from '../../interfaces/filter-group';
import { FilterModalService } from './filter-modal.service';
import {QuerySelector} from "../../interfaces/query-selector";

@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html'
})
export class FilterModalComponent implements OnInit, AfterContentInit, OnDestroy {

  schemaDef: any[] = [];
  aggregateFields: any[] = [];
  modelsAndColumns: any;
  filterGroup: FilterGroup = new FilterGroup();

  models: string[] = [];

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modal') modal: ModalComponent;

  constructor(private filterModalService: FilterModalService,
              private _elementRef: ElementRef) {
    filterModalService.activate = this.activate.bind(this);
  }

  ngOnInit() {

  }

  ngAfterContentInit() {

  }

  ngOnDestroy() {

  }

  activate(pivotConfig: { schemaDef:Array<any>,filterGroup:FilterGroup, aggregateFields: Array<any>, _parent: any}) {
    this.schemaDef = pivotConfig.schemaDef;
    this.aggregateFields = pivotConfig.aggregateFields;
    this.filterGroup = pivotConfig.filterGroup;
    this.models = [];
    this.modelsAndColumns = {};
    for(const key in this.schemaDef) {
      this.models.push(key);
      this.modelsAndColumns[key] = [];
      for(const key1 in this.schemaDef[key]) {
        this.modelsAndColumns[key].push(key1);
      }
    }
    return new Promise<any>((resolve, reject) => {
      resolve(this);
      this.open();
    });
  }

  public ok(){
    this.onSubmit.emit(this);
    this.dismissed();
  }

  public dismissed(isReset?: boolean) {
    if (isReset){
      this.onCancel.emit(this);
    }
    this.modal.hide();
  }

  private open() {
    this.modal.show();
  }

  clearAll(){
    this.filterGroup = new FilterGroup();
  }

  addFilterGroup() {
    let conditionGroup = new ConditionGroup();
    conditionGroup.isParent = true;
    this.filterGroup.conditionGroups.push(conditionGroup);
  }

  removeFilterGroup(conditionGroup) {
    for(let i=0; i<this.filterGroup.conditionGroups.length; i++) {
      if(this.filterGroup.conditionGroups[i].index == conditionGroup.index) {
        this.filterGroup.conditionGroups.splice(i, 1);
      }
    }
  }
}
