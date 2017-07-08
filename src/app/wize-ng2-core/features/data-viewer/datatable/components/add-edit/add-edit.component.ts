import { Component, Input, Output, ViewChild, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from './../../services/datatable.service';
import { DataTableInputConfig, IDataTableInputConfig } from './../../interfaces/index';
import { ModalComponent } from '../../../../modal/modal.component';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';

@Component({
  selector: 'add-edit',
  templateUrl: './add-edit.html',
  styleUrls: ['./add-edit.scss'],
  providers: []
})
export class AddEditComponent implements OnInit {
  @ViewChild('modal') modal:ModalComponent;
  @Input() name:string;
  @Output() modelChanged:EventEmitter<any> = new EventEmitter();
  customFormData:any;
  positiveClick:() => void;
  wrongAnswer:boolean;
  title:string = 'Add Record';
  showAddEditModalSubscription:Subscription;
  closeRuleModalSubscription:Subscription;
  data:any;
  formData:FormGroup;
  dataTableInputConfig:IDataTableInputConfig;
  styleClass:string = 'modal-width-md';
  edit:boolean = false;
  associationData:any = [];
  id:any;
  isRuleModel:boolean = false;
  ruleValidated:boolean = true;
  formValid: boolean = false;
  constructor(private dataTableService:DataTableService,
              private activatedRoute:ActivatedRoute,
              private toastr:CoreToastManager) {
    this.showAddEditModalSubscription = this.dataTableService.showAddEditModal$.subscribe(
      item => {
        if (this.name === item.entity.name) {
          if (item.entity.fact) {
            this.isRuleModel = true;
            this.ruleValidated = false;
          }
          this.activate(item);
        }
      });
    this.closeRuleModalSubscription = this.dataTableService.closeRuleModal$.subscribe(data => {
      this.ruleModalClosed(data);
    });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnChanges() {
  }

  activate(data:any) {
    if(this.formData){
      this.formData.reset();
    }
    this.data = data;
    this.customFormData = data.customFormData;
    this.title = data.title;
    this.styleClass = 'modal-width-md';
    this.edit = this.data.edit;
    if (this.data.mode === 'table') {
      this.styleClass = 'modal-width-lg';
      this.dataTableInputConfig = new DataTableInputConfig(this.data.routes, this.data.target, false, true, null, true);
    }
    this.modal.show();
  }

  addUpdate() {
    this.positiveClick();
    this.modal.hide();
  }

  dismissed() {
    this.modal.hide();
    this.dataTableService.closeModal({});
  }

  onSubmit(event) {
    console.log(event)
  }

  onChanges(event) {
    this.formData = event;
    // Change Validation
    this.formValid = false;
    if (this.formData.valid) {
      this.formValid = true;
    }
  }

  ngOnDestroy() {
    this.showAddEditModalSubscription.unsubscribe();
    this.closeRuleModalSubscription.unsubscribe();
  }

  associationDataUpdated(data) {
    this.associationData = data;
  }

  saveModel() {
    if (this.edit) {
      this.dataTableService.updateRow(this.data.entity.apis.patch, this.data.row.id, this.formData.value).subscribe((data) => {
        this.modal.hide();
        this.modelChanged.emit({name: this.data.entity.name});
        this.toastr.success('Successfully updated record', 'Success');
      }, err => {
        this.modal.hide();
      });
    }
    else {
      if (this.dataTableInputConfig && this.dataTableInputConfig.isAssociation) {
        const apiPath = this.dataTableService.getAPIPath(this.data.primaryEntity, this.data.entity, 'patch', this.id, false);
        this.dataTableService.associateRow(apiPath, this.associationData).subscribe((data) => {
          this.toastr.success('Successfully added record(s)', 'Success');
          this.modelChanged.emit({name: this.data.entity.name});
          this.modal.hide();
        }, err => {
          this.modal.hide();
        });
      }
      else {
        this.dataTableService.addRow(this.data.entity.apis.post, this.formData.value).subscribe((data) => {
          this.toastr.success('Successfully added record', 'Success');
          this.modelChanged.emit({name: this.data.entity.name});
          this.modal.hide();
        }, err => {
          this.modal.hide();
        });
      }
    }
  }

  onRunRule(event) {
    this.dataTableService.showRuleModal({
      primaryEntity: this.data.entity,
      entity: this.data.entity,
      target: this.data.entity.name,
      title: `Run Rules`,
      mode: "form",
      row: {},
      routes: this.data.routes,
      executionData: this.formatExecutionData(event.value),
      customFormData: {
        attributes: this.data.entity.factSchema.attributes,
        settings: {}
      }
    });
  }


  formatExecutionData(row) {
    let executionData = [];
    const item = {
      id: row.id || null,
      name: row.ruleName,
      condition: row.ruleCondition,
      consequence: row.ruleConsequence
    }
    executionData.push(item)
    return executionData;
  }

  ruleModalClosed(data) {
    if (data.matchPath) {
      this.ruleValidated = true;
    } else {
      this.ruleValidated = false;
    }
  }

}
