import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CodeEditorComponent } from './components/code-editor';

@NgModule({
  imports: [
  ],
  declarations: [
    CodeEditorComponent
  ],
  exports: [
    CodeEditorComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class CodeEditorModule {

}
