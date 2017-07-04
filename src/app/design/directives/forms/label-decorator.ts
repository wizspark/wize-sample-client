import { Self, Directive, ElementRef } from '@angular/core';


@Directive({
  selector: 'input,select,textarea',
  host: {
    '[class.has-value]': 'hasValue'
  }
})
export class LabelDecorator {
  private _el: ElementRef;

  constructor(@Self() el: ElementRef) {
    this._el = el;
  }

  get hasValue(): boolean {
    return !!this._el.nativeElement.value
      || (this._el.nativeElement.type !== 'text' && this._el.nativeElement.type !== 'number'
      && this._el.nativeElement.type !== 'password' && this._el.nativeElement.type !== 'textarea');
  }
}
