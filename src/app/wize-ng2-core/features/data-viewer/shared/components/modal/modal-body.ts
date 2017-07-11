import { Component, EventEmitter } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
    selector: 'modal-body',
    template: `
        <div class="modal-body pt-2 pb-3 px-2">
            <ng-content></ng-content>
        </div>
    `
})

export class ModalBodyComponent {
    constructor(private modal: ModalComponent) { }
}
