import {Component, ViewChild, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {AddPricingLookupDataService} from './add-pricing-lookup-data.service';
import {ModalComponent} from '../../shared/components/modal/modal';
import {AdminService} from '../../services/admin.services';
import {PluralService} from '../../../../core/shared/services/pluralize.service';

@Component({
  selector: 'add-pricing-lookup-data',
  templateUrl: './add-pricing-lookup-data.component.html'
})
export class AddPricingLookupDataComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  private positiveClick: () => void;
  private form: FormGroup;
  private activated: boolean = false;
  private isEditMode: boolean;
  private data: any;
  private lookupTypes: any;

  constructor(private addPricingLookupDataService: AddPricingLookupDataService,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private pluralService: PluralService) {
    addPricingLookupDataService.activate = this.activate.bind(this);
  }

  ngOnInit() {
    this.buildForm();
  }

  activate(data?: any) {
    this.activated = true;
    this.data = data;
    this.isEditMode = (data.id > 0);
    this.buildForm(data);
    this.getLookupTypes();
    return new Promise<any>(resolve => {
      this.positiveClick = () => resolve(this.form);
      this.modal.open();
    });
  }

  getLookupTypes() {
    this.adminService.getRows('/api/lookuptypes').subscribe(data => {
      this.lookupTypes = data.rows;
    });
  }

  /**
   * BUILD FORM
   * @param data
   */
  buildForm(data?: any): void {
    this.form = this.formBuilder.group({
      key: [data ? data.key : '', Validators.compose([Validators.required])],
      description: [data ? data.description : '', Validators.compose([Validators.required])],
      LookupTypeId: [data ? data.LookupTypeId : '', Validators.compose([Validators.required])],
      isActive: [data ? data.isActive : true],
      order: [data ? data.order : -1]
    });
  }

  /**
   * ADD UPDATE Pricing Lookup
   */
  public addUpdatePricingLookup() {
    let lookup = {
      key: this.form.controls['key'].value,
      description: this.form.controls['description'].value,
      isActive: this.form.controls['isActive'].value,
      order: this.form.controls['order'].value,
      LookupTypeId: parseInt(this.form.controls['LookupTypeId'].value)
    };

    if (this.isEditMode) {
      //Updated disclosure
      this.adminService.updateRow('/api/lookupdatas', this.data.id, lookup).subscribe(data => {
        this.positiveClick();
        this.modal.dismiss();
      });
    } else {
      // add disclosure
      this.adminService.addRow('/api/lookupdatas', lookup).subscribe(data => {
        this.positiveClick();
        this.modal.dismiss();
      });
    }
  }

  public dismiss() {
    this.form.reset();
    this.modal.dismiss();
  }
}
