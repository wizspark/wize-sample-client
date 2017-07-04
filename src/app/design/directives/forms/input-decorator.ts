import { NgControl } from '@angular/forms';
import { Self, Directive, Input } from '@angular/core';
//import { isPresent } from '@angular/core/src/facade/lang';


@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  host: {
    '[class.form-control-success]': 'valid',
    '[class.form-control-danger]': 'invalid'
  }
})
export class InputDecorator {
  @Input('decorate') decorate: boolean = true;
  private _cd: NgControl;

  constructor(@Self() cd: NgControl) {
    this._cd = cd;
  }

  get valid(): boolean {
    return this.decorate && this._cd.control ? this._cd.control.valid : false;
  }

  get invalid(): boolean {
    return this.decorate && this._cd.control ? !this._cd.control.valid : false;
  }
}
