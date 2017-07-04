import { Directive } from '@angular/core';
import { CommonValidators } from '../common.validators';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validatePassword][ngModel]',
  providers: [{provide: NG_VALIDATORS, useValue: CommonValidators.password, multi: true}]
})
export class PasswordValidatorDirective {
}
