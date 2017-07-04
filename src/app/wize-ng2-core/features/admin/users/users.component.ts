import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { AdminService } from "../services/admin.services";
import { AddUserService } from './add-user/add-user.service'
import { ConfirmationService, IConfirmation } from '../shared/index';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddUserService]
})

export class UsersComponent implements OnInit {
  public form: FormGroup;
  public users: any = [];
  public organizationUnits: any = [];
  public roles: any;
  public userId: any;
  public title: string = 'Add User';


  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private addUserService: AddUserService,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.userId = null;
    this.getUsers();
  }


  /**
   *
   */
  getUsers() {
    const association = [{"model": "WizeOrgUnit"}]; //, {"model": "WizeUserRole"}
    this.adminService.getRows('/api/wizeusers', null, association).subscribe(data => {
      this.users = data.rows;
    });
  }

  /**
   *
   */
  sendActivationLink(row: any) {

  }

  /**
   * Add user
   */
  addUser() {
    this.addUserService.activate(null).then((data: any) => {
      this.toastr.success('Successfully added user.', 'Success');
      this.getUsers();
    });
  }

  /**
   * Delete User
   * @param row
   */
  deleteUser(row) {
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this user ?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        this.adminService.deleteRow('/api/wizeusers', row).subscribe(data => {
          this.toastr.success('Successfully deleted user.', 'Success');
          this.getUsers();
        });
      }
    });
  }

  /**
   * Edit User
   * @param row
   */
  editUser(row) {
    this.addUserService.activate(row).then((data: any) => {
      this.toastr.success('Successfully updated user.', 'Success');
      this.getUsers();
    });
  }

  search(event){
    const text = event.currentTarget.value.trim();
    const association = [{"model": "WizeOrgUnit"}];
    let query = {
      "$or": []
    };
    let cq = {};
    cq['email'] = {$ilike: `%${text}%`};
    query["$or"].push(cq);

    this.adminService.getRows('/api/wizeusers', JSON.stringify(query), association).subscribe(data => {
      this.users = data.rows;
    });
  }

}
