import {Component, EventEmitter, Input, Output, AfterViewInit} from '@angular/core'
import {FormGroup} from '@angular/forms';
import {ControlGroupService} from './../../services/control-group.service'
import {CustomFormData, Settings} from './../../interfaces/form.interfaces'


@Component({
    selector: 'custom-form',
    styleUrls: [ 'form.scss' ],
    templateUrl: './form.html'
})
export class FormComponent {

    // Input
    @Input() set customFormData(value: CustomFormData) {
        this._data = value;
        this._data['settings'] = this._setSettings(value.settings);
        this.sortAttributes();

        let cg = this._controlGroup.create(this._data['attributes']);
        this._form = cg.fbGroup;
        this._matches = cg.matches;
        this.comp = {
            data: this._data,
            form: this._form,
            settings: {
                singleErrorMessage: this._data['settings'].singleErrorMessage,
                errorOnDirty: this._data['settings'].errorOnDirty,
                showValidation: this._data['settings'].showValidation,
                extraValidation: this._data['settings'].submitButtonExtraValidation || true
            }
        };
    }

    // Outputs
    @Output() onSubmit: EventEmitter<any> = new EventEmitter();
    @Output() onChanges: EventEmitter<any> = new EventEmitter();

    comp: any;

    private _data: CustomFormData;
    private _form: FormGroup;
    private _matches: string[];

    constructor(private _controlGroup: ControlGroupService) {}

    submit() { this.onSubmit.emit(this._form.value) }

    ngAfterViewInit(){
        this.onChanges.emit(this._form);
    }

    onAttributeValueChange(event) {
        if (this._matches) {
            let key = Object.keys(event)[0],
            // See if we should check for matches
                mat = this._matches.find(a => a['toMatch'] === key);

            // Update the cg if we found a matcher
            if (mat) this._form.controls[mat['model']].updateValueAndValidity();
        }

        this.onChanges.emit(this._form);
    }

    sortAttributes() { this._data['attributes'].sort((a, b) => a.viewOptions.index - b.viewOptions.index) }

    private _setSettings(settings: Settings) {
        let defaultSettings = {
            submitButton: true,
            submitButtonText: 'Submit',
            submitButtonExtraValidation: null,
            showValidation: true,
            singleErrorMessage: true,
            errorOnDirty: true
        };

        // Add received settings
        if (settings)
            for (let p in defaultSettings)
                defaultSettings[p] = settings.hasOwnProperty(p) ? settings[p] : defaultSettings[p]

        return defaultSettings;
    }
}