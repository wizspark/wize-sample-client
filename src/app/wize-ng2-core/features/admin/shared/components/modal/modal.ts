import { Component, ElementRef, HostBinding, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ModalInstance, ModalResult } from './modal-instance';
import { ModalSize } from './model-size';

@Component({
  selector: 'modal',
  /* tslint:disable */
  host: {
    'class': 'modal',
    'role': 'dialog',
    'tabindex': '-1'
  },
  /* tslint:enable */
  template: `
    <div class="modal-dialog" [ngClass]="{ 'modal-sm': isSmall(), 'modal-lg': isLarge() }">
      <div class="modal-content">
        <ng-content></ng-content>
      </div>
    </div>`
})

export class ModalComponent implements OnDestroy, CanDeactivate<any> {
  @Input() public animation: boolean = true;
  @Input() public backdrop: string | boolean = true;
  @Input() public keyboard: boolean = true;
  @Input() public size: string;

  @Output() public onClose: EventEmitter<any> = new EventEmitter(false);
  @Output() public onDismiss: EventEmitter<any> = new EventEmitter(false);
  @Output() public onOpen: EventEmitter<any> = new EventEmitter(false);
  private instance: ModalInstance;
  private visible: boolean = false;

  @HostBinding('class.fade') get fadeClass(): boolean {
    return this.animation;
  }

  @HostBinding('attr.data-keyboard') get dataKeyboardAttr(): boolean {
    return this.keyboard;
  }

  @HostBinding('attr.data-backdrop') get dataBackdropAttr(): string | boolean {
    return this.backdrop;
  }

  private overrideSize: string = undefined;

  constructor(private element: ElementRef) {
    this.instance = new ModalInstance(this.element);

    this.instance.hidden.subscribe((result) => {
      this.visible = this.instance.visible;
      if (result === ModalResult.Dismiss) {
        this.onDismiss.emit(undefined);
      }
    });

    this.instance.shown.subscribe(() => {
      this.onOpen.emit(undefined);
    });
  }

  public ngOnDestroy() {
    return this.instance && this.instance.destroy();
  }

  public canDeactivate(): any {
    return this.ngOnDestroy();
  }

  public open(size?: string): Promise<void> {
    if (ModalSize.validSize(size)) {
      this.overrideSize = size;
    }
    return this.instance.open().then(() => {
      this.visible = this.instance.visible;
    });
  }

  public close(): Promise<void> {
    return this.instance.close().then(() => {
      this.onClose.emit(undefined);
    });
  }

  public dismiss(): Promise<void> {
    return this.instance.dismiss();
  }

  public isSmall() {
    return this.overrideSize !== ModalSize.Large
      && this.size === ModalSize.Small
      || this.overrideSize === ModalSize.Small;
  }

  public isLarge() {
    return this.overrideSize !== ModalSize.Small
      && this.size === ModalSize.Large
      || this.overrideSize === ModalSize.Large;
  }
}
