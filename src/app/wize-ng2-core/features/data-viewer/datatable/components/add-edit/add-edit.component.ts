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
  @ViewChild('modal') modal: ModalComponent;
  @Input() name: string;
  @Output() modelChanged: EventEmitter<any> = new EventEmitter();
  customFormData: any;
  positiveClick: () => void;
  wrongAnswer: boolean;
  title: string = 'Add Record';
  showAddEditModalSubscription: Subscription;
  data: any;
  formData: FormGroup;
  dataTableInputConfig: IDataTableInputConfig;
  styleClass: string = 'modal-width-md';
  edit: boolean = false;
  associationData: any = [];
  id: any;

  constructor(private dataTableService: DataTableService,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager) {
    this.showAddEditModalSubscription = this.dataTableService.showAddEditModal$.subscribe(
      item => {
        if (this.name === item.entity.name)
          this.activate(item);
      });
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnChanges() {
  }

  activate(data: any) {
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
    if (this.formData.valid) {

    }
  }

  ngOnDestroy() {
    this.showAddEditModalSubscription.unsubscribe();
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
      debugger;
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

}
