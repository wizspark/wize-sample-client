import {Component, EventEmitter, HostBinding, Input, Output, ViewChild,ChangeDetectorRef,AfterViewChecked, AfterViewInit, AfterContentChecked, OnChanges} from '@angular/core'
import {FormGroup} from '@angular/forms';
import {Attribute} from './../../interfaces/form.interfaces'
import {RuleInputControlComponent} from '../../../rule-builder/components/rule-input/rule-input.component';

@Component({
  selector: 'custom-control',
  styleUrls: ['control.scss'],
  templateUrl: './control.html'
})

export class ControlComponent implements AfterContentChecked, OnChanges, AfterViewChecked {

  @Input() set info(value) {
    this.attribute = value.attribute;
    this.form = value.form;
    this.settings = value.settings;
    this.selectedValues = [];
    if (this.attribute.dataType === 'ENUM' && this.attribute.value) {
      this.enumValue = [{id: this.attribute.value, text: this.attribute.value}];
    }
    if (this.attribute.dataType === 'ARRAY' && this.attribute.value) {
      this.attribute.value.forEach(p => {
        this.selectedValues.push({display: p, value: p});
      });
    }
  }

  @Input() entity:any;
  @Output() valueChange:EventEmitter<any> = new EventEmitter();
  @ViewChild(RuleInputControlComponent) ruleInput:RuleInputControlComponent;
  attribute:Attribute;
  form:FormGroup;
  initEnum:any = [];
  enumsValues:any = [];
  selectedValues:any = [];
  private resetSelect:boolean = true;
  private checkboxIsRequired:boolean = false;
  private settings:any;
  private enumValue:any;
  private arrayValue:any;
  private isInit:boolean = false;

  get showErrorMsg() {
    return this.settings.errorOnDirty ?
    !this.form.controls[this.attribute.name].valid && !this.form.controls[this.attribute.name].dirty :
      !this.form.controls[this.attribute.name].valid
  }

  constructor(private cdRef:ChangeDetectorRef) {

  }


  ngAfterViewChecked() {
    if(!this.isInit) {
      if (this.attribute.dataType === 'ENUM' && this.attribute.value) {
        this.enumValue = [{id: this.attribute.value, text: this.attribute.value}];
      }
      if (this.attribute.dataType === 'ARRAY' && this.attribute.value) {
        this.attribute.value.forEach(p => {
          this.selectedValues.push({display: p, value: p});
        });
      }
    }
    this.isInit = true;
    this.onValueChange(this.form);
    this.cdRef.detectChanges();
  }

  ngAfterContentChecked() {
    this.onValueChange(this.form);
  }

  ngOnChanges() {
    this.enumValue = [];
    this.selectedValues = [];
    this.isInit = false;
    this.onValueChange(this.form);
  }

  onValueChange(event) {
    this.valueChange.emit(this.form);
  }

  public refreshValue(value:any):void {
    this.form.controls[this.attribute.name].setValue(value.id);
    this.onValueChange(this.form);
  }

  public onAdd(event) {
    this.selectedValues.push(event);
    let values = [];
    this.selectedValues.forEach((data)=> {
      values.push(data.value);
    });
    this.form.controls[this.attribute.name].setValue(values);
    this.onValueChange(this.form);
  }

  public onRemove(event) {
    let index = this.selectedValues.indexOf(event);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    }
    let values = [];
    this.selectedValues.forEach((data)=> {
      values.push(data.value);
    });
    this.form.controls[this.attribute.name].setValue(values);
    this.onValueChange(this.form);
  }
}
