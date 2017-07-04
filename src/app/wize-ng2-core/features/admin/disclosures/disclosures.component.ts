import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AdminService } from "../services/admin.services";
import { AddDisclosureService } from './add-disclosure/add-disclosure.service'
import { ConfirmationService, IConfirmation } from '../shared/index';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'disclosures',
  templateUrl: './disclosures.component.html',
  styleUrls: ['./disclosures.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddDisclosureService]
})

export class DisclosuresComponent implements OnInit {
  public form: FormGroup;
  public disclosures: any = [];
  public title: string = 'Add Disclosure';


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private addDisclosureService: AddDisclosureService,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getDisclosures();
  }


  /**
   *
   */
  getDisclosures() {
    const association = [{"model": "DisclosureType"}];
    this.adminService.getRows('/api/disclosures', null, association).subscribe(data => {
      this.disclosures = data.rows;
    });
  }

  /**
   * Add disclosure
   */
  addDisclosure() {
    this.addDisclosureService.activate(null).then((data: any) => {
      this.toastr.success('Successfully added disclosure.', 'Success');
      this.getDisclosures();
    });
  }

  /**
   * Delete Disclosure
   * @param row
   */
  deleteDisclosure(row) {
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this disclosure ?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        this.adminService.deleteRow('/api/disclosures', row).subscribe(data => {
          this.toastr.success('Successfully deleted disclosure.', 'Success');
          this.getDisclosures();
        });
      }
    });
  }

  /**
   * Edit disclosure
   * @param row
   */
  editDisclosure(row) {
    this.addDisclosureService.activate(row).then((data: any) => {
      this.toastr.success('Successfully updated disclosure.', 'Success');
      this.getDisclosures();
    });
  }

}
