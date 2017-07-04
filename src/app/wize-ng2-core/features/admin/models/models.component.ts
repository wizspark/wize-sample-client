import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { AdminService } from '../services/admin.services';
import { ConfirmationService, IConfirmation} from '../shared/index';

@Component({
    selector: 'models',
    templateUrl: './models.component.html',
    styleUrls: ['./models.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ModelsComponent implements OnInit {
    public models : any;
    public scopeModels: any;
    public versionedModels: any;
    private selectedModel: any;
    private modelFields: any[] = [];
    private enableStatus: boolean = false;
    @ViewChild('modal') modal: ModalComponent;
    constructor(private _route: ActivatedRoute,
                private http:Http,
                private adminService: AdminService,
                private confirmationService: ConfirmationService) {

    }

    ngOnInit() {
        this.getScopedAndVersionedModels();
    }

    getModels() {
        this.adminService.getRows('/api/metadata/models').subscribe(data => {
            this.models = data;
        });
    }

  getModelFields(modelName) {
    this.modelFields = [];
    this.adminService.getRows('/api/metadata/models/' + modelName).subscribe(data => {
      for(const key in data.schemaDef) {
        let obj  = {};
        obj["name"] = key;
        obj["checked"] = false;
        this.modelFields.push(obj);
      };
      this.enableStatus = false;
      this.open()
    });
  }

  getScopedAndVersionedModels(){
        this.adminService.getScopedAndVersionedModels().subscribe(data => {
            this.scopeModels = data[0].rows;
            this.versionedModels = data[1].rows;
            this.getModels();
        });
    }

    isPrivate(modelName){
        const isModel = this.scopeModels.filter((p) => { return p.modelName === modelName });
        return !!(isModel && isModel.length > 0);
    }

    isVersioned(modelName){
      const isModel = this.versionedModels.filter((p) => { return p.modelName === modelName });
      return !!(isModel && isModel.length > 0);
    }

    updateScopeModel(model, key, event) {
        if (event.currentTarget.checked) {
            let enableConfirmation: IConfirmation = <IConfirmation>{
                title: 'Enable Access Confirmation',
                message: 'Do you want to enable this access ?',
                firstButton: 'Enable',
                secondButton: 'Cancel'
            };
            this.confirmationService.activate(enableConfirmation).then((responseOK) => {
                if (responseOK) {
                    this.adminService.updateScopeModel(model).subscribe(data => {
                        this.getScopedAndVersionedModels();
                    });
                }
            });
        }
        else {
            this.deleteScopeModel(model);
        }
        this.getScopedAndVersionedModels();
    }

    deleteScopeModel(model){
        let deleteConfirmation: IConfirmation = <IConfirmation>{
            title: 'Disable Access Confirmation',
            message: 'Do you want to disable this access ?',
            firstButton: 'Disable',
            secondButton: 'Cancel'
        };
        this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
            if (responseOK) {
                const scopeModel = this.scopeModels.find(p => p.modelName === model.name);
                this.adminService.deleteScopeModel(scopeModel.id).subscribe(data => {
                    this.getScopedAndVersionedModels();
                });
            } else{
                return false;
            }
        });

    }

  updateVersionModel(model, key, event) {
    if (event.currentTarget.checked) {
      this.selectedModel = model;
      this.getModelFields(model.name);
    }
    else {
      this.deleteVersionModel(model);
    }
    //this.getScopedAndVersionedModels();
  }

  deleteVersionModel(model){
    let deleteConfirmation: IConfirmation = <IConfirmation>{
      title: 'Disable Audit Confirmation',
      message: 'Do you want to disable audit ?',
      firstButton: 'Disable',
      secondButton: 'Cancel'
    };
    this.confirmationService.activate(deleteConfirmation).then((responseOK) => {
      if (responseOK) {
        const versionModel = this.versionedModels.find(p => p.modelName === model.name);
        this.adminService.deleteVersionedModel(versionModel.id).subscribe(data => {
          this.getScopedAndVersionedModels();
        });
      } else{
        return false;
      }
    });

  }

  private ok(){
    let model = {};
    model["name"] = this.selectedModel.name;
    model["displayField"] = this.modelFields.find(function (field) {
      return field.checked == true;
    }) || {name:"id"};
    this.adminService.updateVersionedModel(model).subscribe(data => {
      this.dismissed();
    });
  }

  private dismissed(isReset?: boolean) {
    this.getScopedAndVersionedModels();
    this.modal.hide();
  }

  private open() {
    this.modal.show();
  }

  private toggleFieldState(event, field) {
    event.preventDefault();
    this.modelFields.forEach(function(field){
      field.checked = false;
    });
    setTimeout(() => {
      field.checked = true;
      this.enableStatus = true;
    });
  }

}
