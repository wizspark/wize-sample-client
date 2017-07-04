import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdminService} from "../services/admin.services";
import {ConfirmationService, IConfirmation} from '../shared/index';
import {CoreToastManager} from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'pricing-lookups',
  templateUrl: './pricing-lookups.component.html',
  styleUrls: ['./pricing-lookups.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PricingLookupsComponent implements OnInit {
  public form: FormGroup;
  public pricingLookups: any = [];


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getPricingLookups();
  }


  /**
   *
   */
  getPricingLookups() {
    this.adminService.getRows('/api/lookuptypes', null, null).subscribe(data => {
      this.pricingLookups = data.rows;
    });
  }

}
