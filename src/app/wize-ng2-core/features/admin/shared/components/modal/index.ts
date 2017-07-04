import { Type } from '@angular/core';

import { ModalComponent } from './modal';
import { ModalHeaderComponent } from './modal-header';
import { ModalBodyComponent } from './modal-body';
import { ModalFooterComponent } from './modal-footer';
import { AutofocusDirective } from './autofocus';

export * from './modal';
export * from './modal-header';
export * from './modal-body';
export * from './modal-footer';
export * from './modal-instance';

export const MODAL_DIRECTIVES: Array<Type<any>> = [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
];
