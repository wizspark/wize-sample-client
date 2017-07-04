import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AddRoleService } from './add-role.service';
import { ModalComponent } from '../../shared/components/modal/modal';
import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'add-role',
    templateUrl: './add-role.component.html'
})
export class AddRoleComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private positiveClick: () => void;
    private form: FormGroup;
    private activated: boolean = false;
    private isEditMode: boolean;
    private data: any;
    private organizationUnits: any;
    private roles: any;
    private users: any;
    private value: any;
    constructor(private addRoleService: AddRoleService,
                private formBuilder: FormBuilder,
                private adminService: AdminService) {
        addRoleService.activate = this.activate.bind(this);
    }

    ngOnInit() {
        this.buildForm();
    }

    activate(data?: any) {
        this.activated = true;
        if(data){
            this.data = data;
            this.isEditMode = true;
        } else {
            this.isEditMode = false;
        }
        this.buildForm(data);
        return new Promise<any>(resolve => {
            this.positiveClick = () => resolve(this.form);
            this.modal.open();
        });
    }

    /**
     * BUILD FORM
     * @param data
     */
    public buildForm(data? : any): void {
        this.form = this.formBuilder.group({
            name: [data ? data.name :'', Validators.compose([Validators.required])],
        });
    }

    public get name() {
        return this.form.get('name');
    }

    /**
     * ADD UPDATE User
     */
    public addUpdateRole(){
        let role = {
            name : this.form.controls['name'].value
        };
        if(this.isEditMode){
            //Updated User
            this.adminService.updateRow('/api/wizeroles', this.data.id, role).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });
        } else {
            // add user
            this.adminService.addRow('/api/wizeroles', role).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });
        }
    }

    public dismiss(){
        this.form.reset();
        this.modal.dismiss();
    }
}
