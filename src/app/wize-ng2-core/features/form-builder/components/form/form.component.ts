import {Component, EventEmitter, Input, Output, AfterViewInit} from '@angular/core'
import {FormGroup} from '@angular/forms';
import {ControlGroupService} from './../../services/control-group.service'
import {CustomFormData, Settings} from './../../interfaces/form.interfaces'


@Component({
  selector: 'custom-form',
  styleUrls: ['form.scss'],
  templateUrl: './form.html'
})
export class FormComponent {

  // Input
  @Input() set customFormData(value:CustomFormData) {
    this._data = value;
    this._data['settings'] = this._setSettings(value.settings);
    //TODO Handle sorting
    //this.sortAttributes();

    let cg = this._controlGroup.create(this._data['attributes']);
    this._form = cg.fbGroup;
    this._matches = cg.matches;
    this.comp = {
      data: this._data,
      form: this._form,
      settings: {
        singleErrorMessage: this._data['settings'].singleErrorMessage,
        errorOnDirty: this._data['settings'].errorOnDirty,
        showValidation: this._data['settings'].showValidation,
        extraValidation: this._data['settings'].submitButtonExtraValidation || true
      }
    };

    this.ruleAttributes = this.comp.data.attributes.filter((attr)=> attr.name === 'ruleCondition');
    this.attributes = this.comp.data.attributes.filter((attr)=> attr.name !== 'ruleCondition');
  }

  @Input() entity:any;


  // Outputs
  @Output() onSubmit:EventEmitter<any> = new EventEmitter();
  @Output() onChanges:EventEmitter<any> = new EventEmitter();
  @Output() onRunRule:EventEmitter<any> = new EventEmitter();
  comp:any;
  attributes: any = [];
  ruleAttributes:any = [];
  private _data:CustomFormData;
  private _form:FormGroup;
  private _matches:string[];

  constructor(private _controlGroup:ControlGroupService) {
  }

  submit() {
    this.onSubmit.emit(this._form.value)
  }

  ngAfterViewInit() {
    this.onChanges.emit(this._form);
  }

  onAttributeValueChange(event) {

    this.onChanges.emit(event);
  }

  sortAttributes() {
    this._data['attributes'].sort((a, b) => a.viewOptions.index - b.viewOptions.index)
  }

  showRuleModal(event){
    this.onRunRule.emit(event);
  }

  setRuleConditionValue(value){
    this._form.controls['ruleCondition'].setValue(value);
    this._form.controls['ruleCondition'].updateValueAndValidity();
  }

  private _setSettings(settings:Settings) {
    let defaultSettings = {
      submitButton: true,
      submitButtonText: 'Submit',
      submitButtonExtraValidation: null,
      showValidation: true,
      singleErrorMessage: true,
      errorOnDirty: true
    };

    // Add received settings
    if (settings)
      for (let p in defaultSettings)
        defaultSettings[p] = settings.hasOwnProperty(p) ? settings[p] : defaultSettings[p]

    return defaultSettings;
  }


}
