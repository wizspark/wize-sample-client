import { Directive, ElementRef, Renderer, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//import { isBlank } from '@angular/core/src/facade/lang';
import * as moment from 'moment';


const DATE_VALUE_FORMAT = 'YYYY-MM-DD',
  DATE_TIME_VALUE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const isDate = (value) => {
  return moment(new Date(value)).isValid();
};


/**
 * The date accessor for writing a value and listening to changes that can be used by the
 * {@link NgModel}, {@link formControlName} directives.
 */
@Directive({
  selector: 'input[type=date][ngModel],input[type=date][formControl],input[type=date][formControlName]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateValueAccessor),
    multi: true
  }]
})
export class DateValueAccessor implements ControlValueAccessor {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {
  }

  writeValue(value: any): void {
    let normalizedValue = !value ? '' : (isDate(value) ? moment(value).format(DATE_VALUE_FORMAT) : '');
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = v => {
      let d = moment(v, DATE_VALUE_FORMAT);
      let nv = d.isValid() ? d.toDate() : undefined;
      fn(nv);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange = (_) => {
  }
  onTouched = () => {
  }
}


@Directive({
  selector: 'input[type=datetime-local][ngModel],input[type=datetime-local][formControl],input[type=datetime-local][formControlName]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimeValueAccessor),
    multi: true
  }]
})
export class DateTimeValueAccessor implements ControlValueAccessor {
  constructor(private _renderer: Renderer, private _elementRef: ElementRef) {
  }

  writeValue(value: any): void {
    let normalizedValue = !value ? '' : (isDate(value) ? moment(value).format(DATE_TIME_VALUE_FORMAT) : '');
    this._renderer.setElementProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = v => {
      let d = moment(v, DATE_TIME_VALUE_FORMAT);
      let nv = d.isValid() ? d.toDate() : undefined;
      fn(nv);
    };
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onChange = (_) => {
  }
  onTouched = () => {
  }
}
