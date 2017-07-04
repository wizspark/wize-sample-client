import { FormControl, ValidatorFn } from '@angular/forms';
import { ValidationResult } from '../../interfaces/validation-result';

export class CommonValidators {
  public static email(control: FormControl): ValidationResult {
    /* tslint:disable */
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* tslint:enable */
    return re.test(control.value) ? null : {invalidEmail: true};
    /*if (control.value && !re.test(control.value)) {
     return { invalidEmail: true };
     }*/
  }

  public static password(control: FormControl): ValidationResult {
    if (control.value && !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(control.value)) {
      return {invalidPassword: true};
    }
  }

  public static isEqual(otherControl: FormControl): ValidatorFn {
    return (control: FormControl): ValidationResult => {
      if (control.value && otherControl.value && control.value !== otherControl.value) {
        return {notEqual: true};
      }
    };
  }
}
