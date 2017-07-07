import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdminService} from "../../services/admin.services";
import {ConfirmationService, IConfirmation} from '../../shared/index';
import {CoreToastManager} from '../../../../../root/services/core-toast-manager';

@Component({
  selector: 'rule-activities',
  templateUrl: './rule-activities.component.html',
  styleUrls: ['./rule-activities.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RuleActivitiesComponent implements OnInit {
  public form: FormGroup;
  public ruleActivities: any = [];


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getRuleActivities();
  }


  /**
   * Get list of actvities
   */
  getRuleActivities() {
    this.adminService.getRows('/api/wizeactivities', null, null).subscribe(data => {
      this.ruleActivities = data.rows;
    });
  }

}
