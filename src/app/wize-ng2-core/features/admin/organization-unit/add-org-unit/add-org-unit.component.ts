import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { AddOrgUnitService } from './add-org-unit.service';
import { ModalComponent } from '../../shared/components/modal/modal';
import { AdminService } from '../../services/admin.services';

@Component({
    selector: 'add-org-unit',
    templateUrl: './add-org-unit.component.html'
})
export class AddOrganizationComponent implements OnInit {
    @ViewChild('modal') modal: ModalComponent;
    private positiveClick: () => void;
    private form: FormGroup;
    private activated: boolean = false;
    private isEditMode: boolean;
    private data: any;

    constructor(private addOrgUnitService: AddOrgUnitService,
                private formBuilder: FormBuilder,
                private adminService: AdminService) {
        addOrgUnitService.activate = this.activate.bind(this);
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
    buildForm(data? : any): void {
        this.form = this.formBuilder.group({
            description: [data ? data.description : ''],
            name: [data ? data.name : '', Validators.compose([Validators.required])],
            domain: [data ? data.domain : '', Validators.compose([Validators.required, Validators.minLength(5)])],
            footer: [data ? data.metadata.footer : ''],
            logoUrl: [data ? data.metadata.logoUrl : '', Validators.compose([Validators.required, Validators.minLength(10), CustomValidators.url])]
        });
    }


    public get description() {
        return this.form.get('description');
    }

    public get name() {
        return this.form.get('name');
    }

    public get domain() {
        return this.form.get('domain');
    }

    public get footer() {
        return this.form.get('footer');
    }

    public get logoUrl() {
        return this.form.get('logoUrl');
    }

    public dismiss() {
        this.form.reset();
        this.modal.dismiss();
    }

    /**
     * ADD UPDATE ORGANIZATION
     */
    public addOrgUnit(){
        let orgUnit: any = {
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value,
            domain: this.form.controls['domain'].value,
            isDefault: this.data ? this.data.isDefault : false,
            metadata: {
                footer: this.form.controls['footer'].value,
                logoUrl: this.form.controls['logoUrl'].value,
            }
        };
        if(this.isEditMode){
            this.adminService.updateRow('/api/wizeorgunits', this.data.id,  orgUnit).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });

        } else {
            this.adminService.addRow('/api/wizeorgunits', orgUnit).subscribe(data => {
                this.positiveClick();
                this.modal.dismiss();
            });
        }
    }
}
