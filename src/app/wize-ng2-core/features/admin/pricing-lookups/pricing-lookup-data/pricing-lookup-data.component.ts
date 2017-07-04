import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdminService} from "../../services/admin.services";
import {AddPricingLookupDataService} from '../add-pricing-lookup-data/add-pricing-lookup-data.service'
import {ConfirmationService, IConfirmation} from '../../shared/index';
import {CoreToastManager} from '../../../../../root/services/core-toast-manager';

@Component({
  selector: 'pricing-lookup-data',
  templateUrl: './pricing-lookup-data.component.html',
  styleUrls: ['./pricing-lookup-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddPricingLookupDataService]
})

export class PricingLookupDataComponent implements OnInit {
  public form: FormGroup;
  public pricingLookupRecords: any = [];
  public pricingLookupId: any;
  public title: string = 'Add Pricing Lookup Data';


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private addPricingLookupDataService: AddPricingLookupDataService,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.pricingLookupId = this._route.snapshot.params['id'];
    this.getPricingLookupRecords();
  }


  /**
   *
   */
  getPricingLookupRecords() {
    const query = JSON.stringify({"LookupTypeId": this.pricingLookupId});
    this.adminService.getRows('/api/lookupdatas', query, null).subscribe(data => {
      this.pricingLookupRecords = data.rows;
    });
  }

  /**
   * Add pricing lookup
   */
  addPricingLookupRecord() {
    this.addPricingLookupDataService.activate({
      LookupTypeId: this.pricingLookupId,
      isActive: true,
      order: -1
    }).then((data: any) => {
      this.toastr.success('Successfully added lookup data.', 'Success');
      this.getPricingLookupRecords();
    });
  }

  /**
   * Delete pricing lookup
   * @param row
   */
  deletePricingLookupRecord(row) {
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this lookup data?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        this.adminService.deleteRow('/api/lookupdatas', row).subscribe(data => {
          this.toastr.success('Successfully deleted lookup data.', 'Success');
          this.getPricingLookupRecords();
        });
      }
    });
  }

  /**
   * Edit pricing lookup
   * @param row
   */
  editPricingLookupRecord(row) {
    this.addPricingLookupDataService.activate(row).then((data: any) => {
      this.toastr.success('Successfully updated lookup data.', 'Success');
      this.getPricingLookupRecords();
    });
  }

}
