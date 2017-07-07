import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdminService} from "../services/admin.services";
import {AddRuleEventRegistryService} from './add-rule-event-registry/add-rule-event-registry.service'
import {ConfirmationService, IConfirmation} from '../shared/index';
import {CoreToastManager} from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'rule-event-registry',
  templateUrl: './rule-event-registry.component.html',
  styleUrls: ['./rule-event-registry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddRuleEventRegistryService]
})

export class RuleEventRegistryComponent implements OnInit {
  public form: FormGroup;
  public ruleEventRegistries: any = [];


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private addRuleEventRegistryService: AddRuleEventRegistryService,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getRuleEventRegistries();
  }


  /**
   * Get list of events registered
   */
  getRuleEventRegistries() {
    this.adminService.getRows('/api/wizeeventregistries', null, null).subscribe(data => {
      this.ruleEventRegistries = data.rows;
    });
  }

  /**
   * Add event registry
   */
  addEventRegistry() {
    this.addRuleEventRegistryService.activate({

    }).then((data: any) => {
      this.toastr.success('Successfully added event registry.', 'Success');
      this.getRuleEventRegistries();
    });
  }

}
