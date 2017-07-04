import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AddUserService } from './add-user.service';
import { ModalComponent } from '../../shared/components/modal/modal';
import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'add-user',
    templateUrl: './add-user.component.html'
})
export class AddUserComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private positiveClick: () => void;
    private form: FormGroup;
    private activated: boolean = false;
    private isEditMode: boolean;
    private data: any;
    private organizationUnits: any;
    private roles: any;
    private users: any;
    private selectedRoles: any;
    private initRoles: any = [];
    private resetSelect: boolean = false;
    constructor(private addUserService: AddUserService,
                private formBuilder: FormBuilder,
                private adminService: AdminService) {
        addUserService.activate = this.activate.bind(this);
    }

    ngOnInit() {
        this.buildForm();
    }

    activate(data?: any) {
        this.activated = true;
        if(data){
            this.resetSelect = true;
            this.data = data;
            this.isEditMode = true;
            this.getRolesByUser(data.email);
        } else {
            this.isEditMode = false;
        }
        this.buildForm(data);
        this.getOrganizationUnits();
        this.getRoles();
        this.getUsers();
        return new Promise<any>(resolve => {
            this.positiveClick = () => resolve(this.form);
            this.modal.open();
        });
    }

    checkDomain(event: any){
        const userEmail = event.currentTarget.value.split('@').length > 1 ? event.currentTarget.value.split('@')[1] : '';
        const org = this.organizationUnits.find(o => o.domain.toLowerCase() === userEmail.toLowerCase());
        this.form.controls['WizeOrgUnitId'].patchValue(org ? org.id : '');
        this.form.controls['WizeOrgUnitId'].updateValueAndValidity({});

        //Remove user from parent

    }

    removeExistingUser(email){
        const existingUser = this.users.find(u => u.email === email);
        if(existingUser) {
            const index = this.users.indexOf(existingUser);
            this.users.splice(index, 1);
        }
    }

    /**
     *
     * @param email
     */
    getRolesByUser(email: string){
        this.initRoles = [];
        const query = JSON.stringify({ email: email});
        const association = [{ model: "WizeRole"}];
        this.adminService.getRows('/api/wizeuserroles', query, association ).subscribe(data => {
            data.rows.forEach( role => {
                this.initRoles.push({ id: role.WizeRole.id, text: role.WizeRole.name });
            });
            this.resetSelect = false;
        });
    }

    /**
     *
     */
    getUsers(){
        const association = [{"model": "WizeOrgUnit"}]; //, {"model": "WizeUserRole"}
        this.adminService.getRows('/api/wizeusers', null, association).subscribe(data => {
            this.users = data.rows;
            if(this.isEditMode){
                this.removeExistingUser(this.data.email);
            }
        });
    }

    getOrganizationUnits() {
        this.adminService.getRows('/api/wizeorgunits').subscribe(data => {
            this.organizationUnits = data.rows;
        });
    }

    getRoles() {
        this.adminService.getRows('/api/wizeroles').subscribe(data => {
            this.roles = [];
            data.rows.forEach( role => {
               this.roles.push({ id: role.id, text: role.name });
            });
        });
    }

    /**
     * BUILD FORM
     * @param data
     */
    buildForm(data? : any): void {
        this.form = this.formBuilder.group({
            email: [data ? data.email :'', Validators.compose([Validators.required, Validators.email, Validators.maxLength(100)])],
            name: [data && data.metadata ? data.metadata.name :'', Validators.compose([Validators.required])],
            companyName: [data && data.metadata ? data.metadata.companyName :'', Validators.compose([Validators.required, Validators.minLength(5)])],
            phoneNumber: [data && data.metadata ? data.metadata.phoneNumber :'', Validators.compose([Validators.minLength(10), Validators.maxLength(10)])],
            WizeOrgUnitId: [data ? data.WizeOrgUnitId :'', Validators.compose([Validators.required])],
            parentId: [data ? data.parentId : ''],
            isAdmin: [data ? data.isAdmin : false],
            EOM: [data && data.metadata ? data.metadata.EOM : false]
        });
    }

    public get isAdmin() {
        return this.form.get('isAdmin');
    }
    public get EOM() {
        return this.form.get('EOM');
    }

    public get email() {
        return this.form.get('email');
    }

    public get name() {
        return this.form.get('name');
    }

    public get companyName() {
        return this.form.get('companyName');
    }

    public get phoneNumber() {
        return this.form.get('phoneNumber');
    }

    public get WizeOrgUnitId() {
        return this.form.get('WizeOrgUnitId');
    }

    public get parentId() {
        return this.form.get('parentId');
    }

    /**
     * ADD UPDATE User
     */
    public addUpdateUser(){
        let user = {
            email : this.form.controls['email'].value,
            metadata : {
                name : this.form.controls['name'].value,
                companyName : this.form.controls['companyName'].value,
                phoneNumber : this.form.controls['phoneNumber'].value,
                EOM : this.form.controls['EOM'].value
            },
            isAdmin : this.form.controls['isAdmin'].value,
            WizeOrgUnitId: parseInt(this.form.controls['WizeOrgUnitId'].value),
            parentId: parseInt(this.form.controls['parentId'].value),
            roles: []
        };
        if(this.selectedRoles){
            this.selectedRoles.forEach( role => {
                user.roles.push(parseInt(role.id));
            });
        }

        if(this.isEditMode){
            //Updated User
            this.adminService.updateRow('/api/wizeusers/save', this.data.id, user).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });
        } else {
            // add user
            this.adminService.addRow('/api/wizeusers', user).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });
        }
    }

    public dismiss(){
        this.form.reset();
        this.modal.dismiss();
    }

    public refreshValue(value:any):void {
        this.selectedRoles = value;
    }
}
