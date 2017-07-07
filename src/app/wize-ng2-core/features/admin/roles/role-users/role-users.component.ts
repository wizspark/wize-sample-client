import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AdminService } from "../../services/admin.services";

@Component({
    selector: 'role-users',
    templateUrl: './role-users.component.html',
    styleUrls: ['./role-users.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class RoleUsersComponent implements OnInit {
    roleId: string;
    public allUsers: any;
    public roleUsers: any;
    public permissions: any;
    public rawPermissions: any;
    public selectedRecords: any;

    constructor(private _route: ActivatedRoute,
                private http: Http, private adminService: AdminService, private activatedRoute: ActivatedRoute) {
        this.roleId = this.activatedRoute.snapshot.params['id'];
    }

    ngOnInit() {
        if (this.roleId) {
            this.getRolesById();
            this.getRolePermissions();
        }
    }

    /**
     * Get Access Methods
     * @param resource
     * @returns {any}
     */
    getAccessMethods(resource: string): Array<any> {
        return this.rawPermissions.filter(p => p.resource === resource);
    }

    /**
     * Updated Resource Access
     * @param row
     * @param event
     */
    updateAccess(row: any, event: any): void {
        this.rawPermissions.find(p=> p['resource'] == row.resource && p['permission'] === row.permission).access = event.currentTarget.checked;
        this.updateResouce(this.rawPermissions);
    }

    /**
     * Update All Resouce Access
     * @param row
     * @param event
     */
    updateAllResouceAccess(row: any, event: any): void {
        this.rawPermissions.filter(p => p.resource === row.resource).forEach(x=> {
            x['access'] = event.currentTarget.checked;
        });
        this.updateResouce(this.rawPermissions);
    }

    /**
     * Check Resource Access
     * @param row
     * @returns {boolean}
     */
    isResoucesAccessed(row: any): boolean {
        return this.rawPermissions.filter(p => p.resource === row.resource && p.access === true).length > 0 ? true : false;
    }

    /**
     * Get Access in string
     * @param row
     * @returns {string}
     */
    getAccess(row: any): string {
        let access: string = '';
        this.rawPermissions.filter(p => p.resource === row.resource && p.access === true).forEach(x=> {
            //console.log(x.permission);
            if(x.permission) {
              access += access ? `, ${x.permission.split('_')[0]}` : x.permission.split('_')[0];
            }
        });
        return access ? access : 'No Access';
    }

    isUserInRole(user): boolean {
        return this.roleUsers.find(u => u['email'] === user.email);
    }

    updateSelectedRecord(user, event){
        if(event.currentTarget.checked){
            this.selectedRecords.push(user);
        } else {
            const index = this.selectedRecords.indexOf(user, 0);
            if(index > -1){
                this.selectedRecords.splice(index, 1);
            }
        }
        console.log(this.selectedRecords.length);
    }

    // API calls

    /**
     * Update Resource - API
     * @param data
     */
    updateResouce(data) {
        this.adminService.updateEnity(`/api/wizeresourceroles/permissions/${this.roleId}`, data).subscribe(data => {
            // Get fresh role's permissions
            this.getRolePermissions();
        });
    }

    getUsers(): void {
        this.adminService.getRows('/api/wizeusers').subscribe(data => {
            this.allUsers = data.rows;
            this.selectedRecords = [];
            this.roleUsers.forEach(user => {
                const addedUser = this.allUsers.find(u => u['email'] === user.email);
                if(addedUser){
                    this.selectedRecords.push(addedUser);
                }
            });
        });
    }

    /**
     * Get Roles by Id
     */
    getRolesById(): void {
        const query = JSON.stringify({"WizeRoleId": this.roleId});
        this.adminService.getRows('/api/wizeuserroles', query).subscribe(data => {
            this.roleUsers = data.rows;
        });
    }

    /**
     * Get Role Permissions
     */
    getRolePermissions(): void {
        this.adminService.getRowDetail('/api/wizeresourceroles/permissions', this.roleId).subscribe(data => {
            this.permissions = [];
            this.rawPermissions = data;
            data.forEach((p) => {
                if (!this.permissions.find(r => r['resource'] === p['resource'])) {
                    this.permissions.push(p);
                }
            });
        });
    }

    addUsersToRole(){
        this.adminService.updateEnity('/api/wizeuserroles', this.selectedRecords).subscribe(data => {
            //debugger;
        });
    }
}
