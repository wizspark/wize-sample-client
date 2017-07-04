import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { AdminService } from '../services/admin.services';
import { AddRoleService } from './add-role/add-role.service';
import { ConfirmationService, IConfirmation } from '../shared/index';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddRoleService]
})

export class RolesComponent implements OnInit {
  public roles: any;

  constructor(private _route: ActivatedRoute,
              private http: Http,
              private adminService: AdminService,
              private addRoleService: AddRoleService,
              private toastr: CoreToastManager, private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    this.getRoles();
  }

  /**
   * Get Roles
   */
  getRoles() {
    this.adminService.getRows('/api/wizeroles').subscribe(data => {
      this.roles = data.rows;
    });
  }

  /**
   * Add new Role
   */
  addRole() {
    this.addRoleService.activate(null).then((data: any) => {
      this.toastr.success('Successfully added role.', 'Success');
      this.getRoles();
    });
  }

  /**
   * Delete Role
   * @param row
   */
  deleteRole(row) {
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this role ?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        this.adminService.deleteRow('/api/wizeroles', row).subscribe(data => {
          this.toastr.success('Successfully deleted role.', 'Success');
        });
      }
    });
  }

  /**
   * Edit Role
   * @param row
   */
  editRole(row: any) {
    this.addRoleService.activate(row).then((data: any) => {
      this.toastr.success('Successfully updated role.', 'Success');
      this.getRoles();
    });
  }

  search(event){
    const text = event.currentTarget.value.trim();
    let query = {
      "$or": []
    };
    let cq = {};
    cq['name'] = {$ilike: `%${text}%`};
    query["$or"].push(cq);

    this.adminService.getRows('/api/wizeroles', JSON.stringify(query)).subscribe(data => {
      this.roles = data.rows;
    });
  }


}
