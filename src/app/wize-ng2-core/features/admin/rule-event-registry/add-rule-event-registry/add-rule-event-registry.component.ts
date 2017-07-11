import {Component, ViewChild, OnInit, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {AddRuleEventRegistryService} from './add-rule-event-registry.service';
import {ModalComponent} from '../../shared/components/modal/modal';
import {AdminService} from '../../services/admin.services';
import {PluralService} from '../../../../core/shared/services/pluralize.service';

@Component({
  selector: 'add-rule-event-registry',
  templateUrl: './add-rule-event-registry.component.html'
})
export class AddRuleEventRegistryComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  private positiveClick: () => void;
  private form: FormGroup;
  private activated: boolean = false;
  public data : any;
  private isEditMode: boolean;
  public models : any;
  public entity : any;
  public ruleMeta : any;
  public editorConfig : any = {
    lineNumbers: false,
    lineWrapping: false,
    readOnly: false,
    smartIndent: true,
    showCursorWhenSelecting: true,
    gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    mode: {name: 'javascript', globalVars: true},
    autofocus: false,
    viewportMargin: Infinity
  };

  constructor(private addRuleEventRegistryService: AddRuleEventRegistryService,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private pluralService: PluralService) {
    addRuleEventRegistryService.activate = this.activate.bind(this);
  }

  ngOnInit() {
    this.getModels();
    this.getRuleMetaData();
    this.buildForm();
  }

  private getModels() {
    this.adminService.getRows('/api/metadata/models').subscribe(data => {
      this.models = data;
    });
  }

  private getRuleMetaData() {
    this.adminService.getRows('/api/rule-metadata').subscribe(data => {
      this.ruleMeta = data;
    });
  }

  activate(data?: any) {
    this.activated = true;
    if(data){
      this.data = data;
      this.isEditMode = true;
      this.setModelChange(data.modelName);
      this.setActionChange(data.action);
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
  buildForm(data?: any): void {
    this.form = this.formBuilder.group({
      modelName: [data ? data.modelName :'', [Validators.required]],
      evaluationCriteria: [data ? data.evaluationCriteria :'', [Validators.required]],
      ruleCriteria: data ? data.ruleCriteria :'',
      action: [data ? data.action :'', [Validators.required]],
      //name: [data ? data.name :'', [Validators.required]],
      description: data ? data.description :'',
      configuration: data ? data.configuration :'{}'
    });
  }

  public dismiss() {
    this.form.reset();
    this.modal.dismiss();
  }

  public get modelName() {
    if(this.isEditMode && this.form.controls['modelName']){
      this.form.controls['modelName'].disable();
    } else {
      this.form.controls['modelName'].enable();
    }
    return this.form.controls['modelName'];
  }

  public get evaluationCriteria() {
    return this.form.controls['evaluationCriteria'];
  }

  public get ruleCriteria() {
    if(this.isEditMode && this.form.controls['ruleCriteria']){
      this.form.controls['ruleCriteria'].disable();
    } else {
      this.form.controls['ruleCriteria'].enable();
    }
    return this.form.controls['ruleCriteria'];
  }

  public get action() {
    if(this.isEditMode && this.form.controls['action']){
      this.form.controls['action'].disable();
    } else {
      this.form.controls['action'].enable();
    }
    return this.form.controls['action'];
  }

  // public get name() {
  //   return this.form.controls['name'];
  // }

  public get description() {
    if(this.isEditMode && this.form.controls['description']){
      this.form.controls['description'].disable();
    } else {
      this.form.controls['description'].enable();
    }
    return this.form.controls['description'];
  }

  public get configuration() {
    if(this.isEditMode && this.form.controls['configuration']){
      this.form.controls['configuration'].disable();
      this.editorConfig.readOnly = true;
    } else {
      this.form.controls['configuration'].enable();
      this.editorConfig.readOnly = false;
    }
    return this.form.controls['configuration'];
  }

  // public get editorConfig() {
  //   return {
  //     lineNumbers: false,
  //     lineWrapping: false,
  //     readOnly: this.isEditMode,
  //     smartIndent: true,
  //     showCursorWhenSelecting: true,
  //     gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  //     mode: {name: 'javascript', globalVars: true},
  //     autofocus: false,
  //     viewportMargin: Infinity
  //   }
  // }

  public get evaluationCriteria1() {
    // let criteria = [];
    // if(this.ruleMeta) {
    //   for(let key in this.ruleMeta.evaluationCriteria) {
    //     criteria.push(this.ruleMeta.evaluationCriteria[key].description);
    //   }
    // }
    // return criteria;
    return (this.ruleMeta)?Object.keys(this.ruleMeta.evaluationCriteria):[];
  }

  public get actions() {
    let actions = [];
    if(this.ruleMeta) {
      for (let key in this.ruleMeta.actions) {
        actions.push(this.ruleMeta.actions[key]);
      }
    }
    return actions;
  }

  /**
   * ADD UPDATE Rule Event
   */
  public addUpdateRule(){
    let ruleEvent = {
      //name : this.form.controls['name'].value,
      modelName : this.form.controls['modelName'].value,
      description : this.form.controls['description'].value,
      evaluationCriteria : this.form.controls['evaluationCriteria'].value,
      ruleCriteria : this.form.controls['ruleCriteria'].value,
      action : this.form.controls['action'].value,
      configuration : JSON.parse(this.form.controls['configuration'].value),
      isActive : true
    };
    if(this.isEditMode){
      //Updated Rule
      this.adminService.updateRow('/api/wizeeventregistries', this.data.id, ruleEvent).subscribe(data => {
        this.positiveClick();
        this.modal.dismiss();
      });
    } else {
      // add rule
      this.adminService.addRow('/api/wizeeventregistries', ruleEvent).subscribe(data => {
        this.positiveClick();
        this.modal.dismiss();
      });
    }
  }

  public selectAction(event) {
    event.preventDefault();
    let action = event.currentTarget.value;
    this.setActionChange(action);
  }

  private setActionChange(action) {
    if(action) {
      for (let key in this.ruleMeta.actions) {
        if(this.ruleMeta.actions[key].name === action) {
          let params = this.ruleMeta.actions[key].params;
          let obj = {};
          let properties = Object.keys(params);
          for(let property of properties) {
            if(params[property].type == "object") {
              obj[property] = params[property].sample;
            } else {
              obj[property] = "";
            }
          }
          this.form.controls['configuration'].setValue(JSON.stringify(obj, null, 4));
        }
      }
    } else {
      this.form.controls['configuration'].setValue("{}");
    }
  }

  public selectModel(event) {
    event.preventDefault();
    this.entity = null;
    let modelName = event.currentTarget.value;
    this.setModelChange(modelName);
  }

  private setModelChange(modelName) {
    if(modelName) {
      this.adminService.getRows('/api/metadata/models/' + modelName).subscribe(data => {
        this.entity = {};
        this.entity["name"] = modelName;
        this.entity["fact"] = modelName;
        this.entity["factSchema"] = {};
        this.entity["factSchema"]["name"] = modelName;
        this.entity["factSchema"]["attributes"] = [];
        if(data && data.schemaDef) {
          let attributes = [];
          Object.keys(data.schemaDef).forEach(column => {
            let obj = {};
            obj["name"] = column;
            obj["type"] = data.schemaDef[column].type;
            obj["displayName"] = data.schemaDef[column].displayName;
            attributes.push(obj);
          });
          this.entity["factSchema"]["attributes"] = attributes;
        }
      });
    }
  }

  setRuleConditionValue(value){
    this.form.controls['ruleCriteria'].setValue(value);
    this.form.controls['ruleCriteria'].updateValueAndValidity();
  }
}
