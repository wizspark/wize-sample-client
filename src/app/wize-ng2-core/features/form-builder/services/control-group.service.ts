import {Injectable} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Attribute, Validation} from './../interfaces/form.interfaces'
import {CustomValidators} from './../validator/custom.validator'

@Injectable()
export class ControlGroupService {
    create(attributes: Attribute[]): any {
        let controlGroup = {},
            toReturn = {},
            matches = [];

        attributes.forEach(a => {
            let val = a.value || '',
                validators = null;

            if (a.validation) {

                if (Array.isArray(a.validation)) {
                    validators = [];
                    a.validation.forEach(i => validators.push(setValidator(i, a)));
                }

                else validators = setValidator(a.validation)
            }

            controlGroup[a.name] = new FormControl(val, validators);
        });

        toReturn['fbGroup'] = new FormGroup(controlGroup);

        // Add matches for watching if required
        if (matches.length) toReturn['matches'] = matches;

        return toReturn;

        function setValidator(item: Validation, original?) {
            switch (item.type) {
                case 'required': return Validators.required;
                case 'minLength': return Validators.minLength(item.value);
                case 'maxLength': return Validators.maxLength(item.value);
                case 'pattern': return Validators.pattern(item.value);
                case 'custom': return item.value;
                case 'match':
                    matches.push({toMatch: item.value, model: original.name});
                    return CustomValidators.match(item.value);
            }
        }
    }
}
