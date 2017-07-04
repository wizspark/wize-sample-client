import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ModalComponent
    ],
    declarations: [
        ModalComponent
    ],
    providers: [ ]
})

export class ModalModule { }
