import { Component, Input, Output, ViewChild, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from './../../services/datatable.service';
import { DataTableInputConfig, IDataTableInputConfig } from './../../interfaces/index';
import { ModalComponent } from '../../../../modal/modal.component';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';

@Component({
  selector: 'rule-input',
  templateUrl: './rule-input.html',
  styleUrls: ['./rule-input.scss'],
  providers: []
})
export class RuleInputComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Input() name: string;
  @Output() modelChanged: EventEmitter<any> = new EventEmitter();
  customFormData: any;
  positiveClick: () => void;
  title: string = 'Run Rules';
  showRuleModalSubscription: Subscription;
  data: any;
  formData: FormGroup;
  styleClass: string = 'modal-width-md';
  executionData: any;
  constructor(private dataTableService: DataTableService,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager) {
    this.showRuleModalSubscription = this.dataTableService.showRuleModal$.subscribe(
      item => {
        if (this.name === item.entity.name)
          this.activate(item);
      });
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  activate(data: any) {
    this.data = data;
    this.customFormData = data.customFormData;
    this.title = data.title;
    this.styleClass = 'modal-width-md';
    this.executionData = data.executionData;
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
    this.showRuleModalSubscription.unsubscribe();
  }

  executeRules() {
      this.dataTableService.runRules(this.formData.value, this.executionData).subscribe((data) => {
        this.dataTableService.closeRuleModal(data);
        this.modal.hide();
        this.toastr.success('Successfully executed the rules', 'Success');
      }, err => {
        this.dataTableService.closeRuleModal(err);
        this.modal.hide();
      });
  }

}
