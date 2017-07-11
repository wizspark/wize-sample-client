import { Component, EventEmitter, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'modal-footer',
  styles: [`
    .btn[hidden] {
      display: none;
    }
  `],
  template: `
    <div class="modal-footer">
      <ng-content></ng-content>
    </div>`
})

export class ModalFooterComponent {

  @Input() public showDefaultButtons: boolean = false;

  constructor(private modal: ModalComponent) {
  }
}
