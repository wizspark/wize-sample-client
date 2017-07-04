import { Directive } from '@angular/core';
import { CommonValidators } from '../common.validators';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEmail][ngModel]',
  providers: [{provide: NG_VALIDATORS, useValue: CommonValidators.email, multi: true}],
})
export class EmailValidatorDirective {
}
