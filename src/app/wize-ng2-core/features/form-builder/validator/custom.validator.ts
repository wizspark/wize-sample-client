import { FormControl } from '@angular/forms';

export class CustomValidators {
  static match(key:string) {
    return (formControl:FormControl) => {
      if (formControl.value && formControl.root['controls'])
        return formControl.root['formControl'][key].value !== formControl.value ? {
          'match': {
            'currentValue': formControl.value,
            'requiredValue': formControl.root['controls'][key].value,
            'mustMatchField': key
          }
        } : null;
      return null;
    }
  }


}
