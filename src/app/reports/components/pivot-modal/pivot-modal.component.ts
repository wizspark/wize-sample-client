import { Component, ViewChild, ElementRef, OnInit, Input, Output, AfterContentInit, EventEmitter, OnDestroy  } from '@angular/core';
import { ModalComponent } from '../../../wize-ng2-core/features/modal/modal.component';
import { PivotModalService } from './pivot-modal.service';
import { PivotGroup, ConditionGroup } from '../../interfaces/filter-group';

@Component({
  selector: 'pivot-modal',
  templateUrl: 'pivot-modal.component.html',
  styleUrls: ['pivot-modal.component.scss']
})
export class PivotModalComponent implements OnInit, AfterContentInit, OnDestroy {

  schemaDef: any[] = [];
  modelsAndColumns: any;
  pivotGroup: PivotGroup = new PivotGroup();

  models: string[] = [];

  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modal') modal: ModalComponent;

  constructor(private PivotFilterModalService: PivotModalService,
              private _elementRef: ElementRef) {
    PivotFilterModalService.activate = this.activate.bind(this);
  }

  ngOnInit() {

  }

  ngAfterContentInit() {

  }

  ngOnDestroy() {

  }

  activate(pivotConfig: { schemaDef:Array<any>,pivotGroup:PivotGroup, _parent: any}) {

    this.schemaDef = pivotConfig.schemaDef;
    this.pivotGroup = pivotConfig.pivotGroup;
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

  clearAll(callback?: Function){
    this.pivotGroup = new PivotGroup();
    this.pivotGroup.conditionGroups[0].conditions[0].showOperator = true;
    this.pivotGroup.conditionGroups[0].conditions[0].conditionOperator = "WHEN";
    if(callback) {
      callback();
    }
  }

  addFilterGroup() {
    let conditionGroup = new ConditionGroup();
    this.pivotGroup.conditionGroups.push(conditionGroup);
  }

  removeFilterGroup(conditionGroup) {
    for(let i=0; i<this.pivotGroup.conditionGroups.length; i++) {
      if(this.pivotGroup.conditionGroups[i].index == conditionGroup.index) {
        this.pivotGroup.conditionGroups.splice(i, 1);
      }
    }
  }
}
