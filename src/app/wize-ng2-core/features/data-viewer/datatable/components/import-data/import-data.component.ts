import { Component, Input, ViewChild, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataTableService } from './../../services/datatable.service';
import { ModalComponent } from '../../../../modal/modal.component';
@Component({
  selector: 'import-data',
  templateUrl: './import-data.html',
  styleUrls: ['import-data.scss'],
  providers: []
})
export class ImportDataComponent implements OnInit {
  @ViewChild('modal') modal:ModalComponent;
  private customFormData:any;
  private positiveClick:() => void;
  public wrongAnswer:boolean;
  public title:string = 'Add Record';
  showImportModalSubscription:Subscription;

  form:FormGroup;
  override:FormControl;
  dataFileControl:FormControl;
  dataFile:File;

  constructor(private _formBuilder:FormBuilder,
              private dataTableService:DataTableService) {
    this.showImportModalSubscription = this.dataTableService.showImportModal$.subscribe(
      item => {
        this.activate(item);
      });
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges() {
  }

  buildForm() {
    this.override = new FormControl(false);
    this.dataFileControl = new FormControl(undefined);

    this.form = this._formBuilder.group({
      override: this.override,
      dataFileControl: this.dataFileControl
    });
  }

  activate(data:any) {
    this.title = data.title;
    this.buildForm();
    this.modal.show();
  }

  importData() {
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
    console.log(event)
  }

  ngOnDestroy() {
    this.showImportModalSubscription.unsubscribe();
  }

  onFileChange(files:FileList) {
    this.dataFile = files.item(0);
    if (files.length !== 0) {
      let allowedFileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (allowedFileTypes.indexOf(files.item(0).type) <= -1) {
        let error = {importDataInvalid: 'Only csv and xlsx files are allowed.'};
        this.dataFileControl.setErrors(error);
        this.dataFileControl.markAsDirty(true);
      } else {
        this.dataFileControl.setErrors(undefined);
        this.dataFileControl.markAsDirty(false);
      }
    } else {
      let error = {importDataRequired: 'Please choose csv or xlsx file to upload'};
      this.dataFileControl.setErrors(error);
      this.dataFileControl.markAsDirty(true);
    }
  }
}
