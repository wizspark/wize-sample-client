import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AdminService } from '../services/admin.services';
import { AddOrgUnitService } from './add-org-unit/add-org-unit.service';
import { ConfirmationService, IConfirmation } from '../shared/index';
import { CoreToastManager } from '../../../../root/services/core-toast-manager';

@Component({
  moduleId: module.id,
  selector: 'selector',
  templateUrl: 'organization-unit.component.html',
  styleUrls: ['./organization-unit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AddOrgUnitService]
})
export class OrganizationUnitComponent implements OnInit {
  organizationUnits: any;

  constructor(private adminService: AdminService,
              private addOrgUnitService: AddOrgUnitService,
              private toastr: CoreToastManager,
              private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    this.getOrganizationUnits();
  }

  getOrganizationUnits() {
    this.adminService.getRows('/api/wizeorgunits').subscribe(data => {
      this.organizationUnits = data.rows;
    });
  }

  addOrganization() {
    this.addOrgUnitService.activate(null).then((data: any) => {
      this.toastr.success('Successfully added organization', 'Success');
      this.getOrganizationUnits();
    });
  }

  deleteOrganization(row) {
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Delete Confirmation',
      message: 'Do you want to delete this organization ?',
      firstButton: 'Delete',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        this.adminService.deleteRow('/api/wizeorgunits', row).subscribe(data => {
          this.toastr.success('Successfully deleted organization', 'Success');
        });
      }
    });

  }

  editOrganization(row) {
    this.addOrgUnitService.activate(row).then((data: any) => {
      this.toastr.success('Successfully updated organization', 'Success');
      this.getOrganizationUnits();
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
    cq['description'] = {$ilike: `%${text}%`};
    query["$or"].push(cq);

    this.adminService.getRows('/api/wizeorgunits', JSON.stringify(query)).subscribe(data => {
      this.organizationUnits = data.rows;
    });
  }
}
