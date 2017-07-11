import {Injectable} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Attribute, Validation} from './../interfaces/form.interfaces'
//import {CustomValidators} from './../validator/custom.validator';
import { CustomValidators } from 'ng2-validation';

@Injectable()
export class ControlGroupService {
  create(attributes:Attribute[]):any {
    let controlGroup = {},
      toReturn = {},
      matches = [];
    attributes.forEach(a => {
      let val = a.value || '',
        validators = [];
      // Parse Validators
      //a.validation = setValidator(a);
      validators = setValidator(a);
      controlGroup[a.name] = new FormControl(val, validators);
    });

    toReturn['fbGroup'] = new FormGroup(controlGroup);

    // Add matches for watching if required
    if (matches.length) toReturn['matches'] = matches;

    return toReturn;

    function setValidator(attr:Attribute, original?) {
      let attrValidators = [];
      if (attr.required || !attr.allowNull) {
        attrValidators.push(Validators.required);
      }
      switch (attr.dataType) {
        case 'INTEGER':
          attrValidators.push(CustomValidators.digits);
          break;
        case 'BIGINT':
          attrValidators.push(CustomValidators.digits);
          break;
        case 'FLOAT':
          attrValidators.push(Validators.pattern(/^[+-]?\d+(\.\d+)?$/));
          break;
        case 'REAL':
          attrValidators.push(CustomValidators.number);
          break;
        case 'DOUBLE':
          attrValidators.push(Validators.pattern(/^\d{0,2}(\.\d{0,2}){0,1}$/));
          break;
        case 'DECIMAL':
          attrValidators.push(Validators.pattern(/^\d+\.\d{0,2}$/));
          break;
        case 'WIZE_MONEY':
          attrValidators.push(Validators.pattern(/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/));
          break;
        case 'WIZE_URL':
          attrValidators.push(CustomValidators.url);
          break;
        case 'JSON':
          attrValidators.push(CustomValidators.json);
          break;
        case 'JSONB':
          attrValidators.push(CustomValidators.json);
          break;

      }

      return attrValidators;
    }
  }
}
