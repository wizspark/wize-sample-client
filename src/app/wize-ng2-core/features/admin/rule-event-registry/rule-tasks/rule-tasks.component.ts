import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import {AdminService} from "../../services/admin.services";
import {ConfirmationService, IConfirmation} from '../../shared/index';
import {CoreToastManager} from '../../../../../root/services/core-toast-manager';

@Component({
  selector: 'rule-tasks',
  templateUrl: './rule-tasks.component.html',
  styleUrls: ['./rule-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RuleTasksComponent implements OnInit {
  public form: FormGroup;
  public ruleTasks: any = [];


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getRuleTasks();
  }


  /**
   * Get list of tasks
   */
  getRuleTasks() {
    this.adminService.getRows('/api/wizetasks', null, null).subscribe(data => {
      this.ruleTasks = data.rows;
    });
  }

}
