import {Component, ViewChild, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {AddRuleEventRegistryService} from './add-rule-event-registry.service';
import {ModalComponent} from '../../shared/components/modal/modal';
import {AdminService} from '../../services/admin.services';
import {PluralService} from '../../../../core/shared/services/pluralize.service';

@Component({
  selector: 'add-rule-event-registry',
  templateUrl: './add-rule-event-registry.component.html'
})
export class AddRuleEventRegistryComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  private positiveClick: () => void;
  private form: FormGroup;
  private activated: boolean = false;
  private isEditMode: boolean;

  constructor(private addRuleEventRegistryService: AddRuleEventRegistryService,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private pluralService: PluralService) {
    addRuleEventRegistryService.activate = this.activate.bind(this);
  }

  ngOnInit() {
    this.buildForm();
  }

  activate(data?: any) {
    this.activated = true;
    return new Promise<any>(resolve => {
      this.positiveClick = () => resolve(this.form);
      this.modal.open();
    });
  }

  /**
   * BUILD FORM
   * @param data
   */
  buildForm(data?: any): void {
    this.form = this.formBuilder.group({

    });
  }

  public dismiss() {
    this.form.reset();
    this.modal.dismiss();
  }
}
