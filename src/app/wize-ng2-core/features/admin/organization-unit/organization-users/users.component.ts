import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AdminService } from "../../services/admin.services";
import { ToastsManager } from 'ng2-toastr';
@Component({
  selector: 'org-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OrganizationUsersComponent implements OnInit {
  public users : any = [];
  public orgId: any;


  constructor(private _route: ActivatedRoute,
              private http:Http,
              private adminService:AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastsManager) {
  }

  ngOnInit() {
      this.orgId = this._route.snapshot.params['id'];
      this.getUsers();
  }


  /**
   *
   */
  getUsers(){
    const query = JSON.stringify({"WizeOrgUnitId": this.orgId});
    this.adminService.getRows('/api/wizeusers', query).subscribe(data => {
      this.users = data.rows;
    });
  }

}
