import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormComponent} from './components/form/form.component';
import {ControlComponent} from './components/control/control.component';
import {ControlGroupService} from './services/control-group.service';
import { RuleBuilderModule } from '../rule-builder/index';
import { CodeEditorModule } from '../../../editor/index';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CodeEditorModule],
    declarations: [FormComponent, ControlComponent],
    providers: [ControlGroupService],
    exports: [FormComponent]
})
export class CustomFormModule {

}
