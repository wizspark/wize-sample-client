import { Directive, forwardRef, Input, OnInit } from '@angular/core';
import { CommonValidators } from '../common.validators';
import { FormControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[isEqual][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: IsEqualValidatorDirective, multi: true}]
})
export class IsEqualValidatorDirective implements OnInit {

  private validator: ValidatorFn;

  @Input() private isEqual: FormControl;

  public ngOnInit() {
    this.validator = CommonValidators.isEqual(this.isEqual);
  }

  public validate(c: FormControl) {
    return this.validator(c);
  }
}
