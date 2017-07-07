import {Component, EventEmitter, HostBinding, Input, Output, ViewChild} from '@angular/core'
import {FormGroup} from '@angular/forms';
import {Attribute} from './../../interfaces/form.interfaces'
import {RuleInputControlComponent} from '../../../rule-builder/components/rule-input/rule-input.component';
@Component({
    selector: 'custom-control',
    styleUrls: [ 'control.scss' ],
    templateUrl: './control.html'
})

export class ControlComponent {

    @Input() set info(value) {
        this.attribute = value.attribute;
        this.form = value.form;
        this.settings = value.settings;

        if (this.attribute.type === 'checkbox') {
            this.attribute.value = !this.attribute.value ? [] : this.attribute.value;
            this.checkboxIsRequired = (this.attribute.validation && this.attribute.validation.find(a => a.type === 'required')) ? true : false;
        }
    }

    @Output() valueChange: EventEmitter<any> = new EventEmitter();
    @ViewChild(RuleInputControlComponent) ruleInput: RuleInputControlComponent;
    attribute: Attribute;
    form: FormGroup;

    private checkboxIsRequired: boolean = false;
    private settings: any;

    get showErrorMsg() {
        return this.settings.errorOnDirty ?
        !this.form.controls[this.attribute.name].valid && !this.form.controls[this.attribute.name].dirty :
            !this.form.controls[this.attribute.name].valid
    }


    errors() {
        if (this.attribute.validation && !this.form.controls[this.attribute.name].valid) {
            let temp: any = [],
                errors = this.form.controls[this.attribute.name].errors,
                errorKeys = Object.keys(errors);

            if (this.settings.singleErrorMessage) temp.push(this._setError(errorKeys[errorKeys.length - 1], errors));
            else errorKeys.forEach(a => temp.push(this._setError(a, errors)));

            return temp;
        }
    }

    setRadio(option) {
        this.form.controls[this.attribute.name].setValue(option.value);
        this.onValueChange(option.value)
    }

    setCheckbox(option) {
        let index = this.attribute.value.indexOf(option.value);

        if (index !== -1) this.attribute.value.splice(index, 1);
        else this.attribute.value.push(option.value);

        this.form.controls[this.attribute.name].setValue(this.attribute.value);
        this.onValueChange(this.attribute.value)
    }

    chackboxValueChange() {
        if (this.checkboxIsRequired) {
            if (this.attribute.value.length === 1) this.attribute.options.find(a => a.value === this.attribute.value[0]).disabled = true;
            else this.attribute.options.forEach(a => a.disabled = false)
        }
    }

    onValueChange(event) { if (this.attribute.emitChanges !== false) this.valueChange.emit({[this.attribute.name]: event}) }
    isSelectActive(option) { return this.attribute.value.find(a => a === option.value) ? true : false }

    private _setError(item, errors) {
        let errorMsg: string = this.attribute.validation.find(a => a.type.toLowerCase() === item).message,
            tag: string = this.attribute.title || this.attribute.name;

        if (!errorMsg) {
            switch (item) {
                // Set error messages
                case 'required':
                    errorMsg = `${tag} is required.`;
                    break;

                case 'minlength':
                    errorMsg = `${tag} has to be at least ${errors[item].requiredLength} characters long.`;
                    break;

                case 'maxlength':
                    errorMsg = `${tag} can't be longer then ${errors[item].requiredLength} characters.`;
                    break;

                case 'pattern':
                    errorMsg = `${tag} must match this pattern: ${errors[item].requiredPattern}.`;
                    break;

                case 'match':
                    errorMsg = `${tag} must match the ${errors[item].mustMatchField} field.`;
                    break;
            }
        }

        return errorMsg;
    }
}
