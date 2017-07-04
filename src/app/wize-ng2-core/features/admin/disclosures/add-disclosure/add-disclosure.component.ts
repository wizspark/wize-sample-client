import {Component, ViewChild, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {AddDisclosureService} from './add-disclosure.service';
import {ModalComponent} from '../../shared/components/modal/modal';
import {AdminService} from '../../services/admin.services';
import {PluralService} from '../../../../core/shared/services/pluralize.service';

@Component({
  selector: 'add-disclosure',
  templateUrl: './add-disclosure.component.html'
})
export class AddDisclosureComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  private positiveClick: () => void;
  private form: FormGroup;
  private activated: boolean = false;
  private isEditMode: boolean;
  private data: any;
  private disclosureTypes: any;
  private records: any;

  constructor(private addDisclosureService: AddDisclosureService,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private pluralService: PluralService) {
    addDisclosureService.activate = this.activate.bind(this);
  }

  ngOnInit() {
    this.buildForm();
  }

  activate(data?: any) {
    this.activated = true;
    if (data) {
      this.data = data;
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
    this.buildForm(data);
    this.getDisclosureTypes();
    return new Promise<any>(resolve => {
      this.positiveClick = () => resolve(this.form);
      this.modal.open();
    });
  }

  getDisclosureTypes() {
    this.adminService.getRows('/api/disclosuretypes').subscribe(data => {
      this.disclosureTypes = data.rows;
      const disclosureTypeId = parseInt(this.form.controls['DisclosureTypeId'].value);
      if (disclosureTypeId > 0)
        this.getRecords(disclosureTypeId);
    });
  }

  getRecords(disclosureTypeId) {
    const selectedDisclosure = this.disclosureTypes.find(d => d.id === disclosureTypeId);
    this.adminService.getRows(`/api/${this.pluralService.pluralize(selectedDisclosure.referenceEntity)}`).subscribe(data => {
      this.records = data.rows.map((a) => {
        return a[selectedDisclosure.referenceField];
      });
    });
  }

  onSelect(disclosureTypeId) {
    this.getRecords(parseInt(disclosureTypeId));
  }

  /**
   * BUILD FORM
   * @param data
   */
  buildForm(data?: any): void {
    this.form = this.formBuilder.group({
      recordId: [data ? data.recordId : '', Validators.compose([Validators.required])],
      note: [data ? data.note : '', Validators.compose([Validators.required])],
      DisclosureTypeId: [data ? data.DisclosureTypeId : '', Validators.compose([Validators.required])],
      isActive: [data ? data.isActive : true],
      effectiveStartDate: [data ? data.effectiveStartDate : null],
      effectiveEndDate: [data ? data.effectiveEndDate : null]
    });
  }

  /**
   * ADD UPDATE Disclosure
   */
  public addUpdateDisclosure() {
    let disclosure = {
      recordId: this.form.controls['recordId'].value,
      note: this.form.controls['note'].value,
      isActive: this.form.controls['isActive'].value,
      effectiveStartDate: this.form.controls['effectiveStartDate'].value || null,
      effectiveEndDate: this.form.controls['effectiveEndDate'].value || null,
      DisclosureTypeId: parseInt(this.form.controls['DisclosureTypeId'].value)
    };
    if(disclosure.effectiveStartDate === '') delete disclosure.effectiveStartDate;
    if(disclosure.effectiveEndDate === '') delete disclosure.effectiveEndDate;

    if (this.isEditMode) {
      //Updated disclosure
      this.adminService.updateRow('/api/disclosures', this.data.id, disclosure).subscribe(data => {
        this.positiveClick();
        this.modal.dismiss();
      });
    } else {
      // add disclosure
      this.adminService.addRow('/api/disclosures', disclosure).subscribe(data => {
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
