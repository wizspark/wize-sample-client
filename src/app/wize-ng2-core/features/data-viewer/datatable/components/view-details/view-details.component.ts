import { Component, Input, Output, ViewChild, OnInit, OnDestroy, OnChanges, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService } from './../../services/datatable.service';
import { DataTableInputConfig, IDataTableInputConfig } from './../../interfaces/index';
import { ModalComponent } from '../../../../modal/modal.component';
import { CoreToastManager } from '../../../../../../root/services/core-toast-manager';

@Component({
  selector: 'view-details',
  templateUrl: './view-details.html',
  styleUrls: ['./view-details.scss'],
  providers: []
})
export class ViewDetailComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Input() name: string;
  positiveClick: () => void;
  title: string = 'Details';
  showDetailsModalSubscription: Subscription;
  data: any;
  styleClass: string = 'modal-width-md';
  edit: boolean = false;
  associationData: any = [];
  id: any;

  constructor(private dataTableService: DataTableService,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager) {
    this.showDetailsModalSubscription = this.dataTableService.showDetailsModal$.subscribe(
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
    this.modal.show();
  }

  addUpdate() {
    this.positiveClick();
    this.modal.hide();
  }

  dismissed() {
    this.modal.hide();
  }

  onSubmit(event) {
    console.log(event)
  }


  ngOnDestroy() {
    this.showDetailsModalSubscription.unsubscribe();
  }


}
