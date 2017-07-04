import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

declare var jQuery: any;

export class ModalInstance {
  public shown: Observable<void>;
  public hidden: Observable<ModalResult>;
  public visible: boolean = false;
  private result: ModalResult;

  private shownEventName: string = 'shown.bs.modal';
  private hiddenEventName: string = 'hidden.bs.modal';
  private $modal: any;

  constructor(private element: ElementRef) {
    this.init();
  }

  public open(): Promise<any> {
    return this.show();
  }

  public close(): Promise<any> {
    this.result = ModalResult.Close;
    return this.hide();
  }

  public dismiss(): Promise<any> {
    this.result = ModalResult.Dismiss;
    return this.hide();
  }

  public destroy(): Promise<any> {
    return this.hide().then(() => {
      if (this.$modal) {
        this.$modal.data('bs.modal', undefined);
        this.$modal.remove();
      }
    });
  }

  private show() {
    let promise = toPromise(this.shown);
    this.$modal.modal();
    return promise;
  }

  private hide(): Promise<ModalResult> {
    if (this.$modal && this.visible) {
      let promise = toPromise(this.hidden);
      this.$modal.modal('hide');
      return promise;
    }
    return Promise.resolve(this.result);
  }

  private init() {
    this.$modal = jQuery(this.element.nativeElement);
    this.$modal.appendTo('body');

    this.shown = Observable.fromEvent(this.$modal, this.shownEventName)
      .map(() => {
        this.visible = true;
      });

    this.hidden = Observable.fromEvent(this.$modal, this.hiddenEventName)
      .map(() => {
        let result = (!this.result || this.result === <any> ModalResult.None)
          ? ModalResult.Dismiss : this.result;

        this.result = ModalResult.None;
        this.visible = false;

        return result;
      });
  }
}

function toPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    observable.subscribe((next) => {
      resolve(next);
    });
  });
}

export enum ModalResult {
  None,
  Close,
  Dismiss
}
