import {
  ElementRef, Input, OnChanges, SimpleChanges, Directive, OnInit, OnDestroy, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var $: any;

@Directive({
  selector: 'input[type=text][datePicker]',
  host: {
    '(blur)': 'onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerDirective),
    multi: true
  }]
})
export class DatePickerDirective implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  @Input('datePicker') options: any;
  @Input() value: any;

  @Input('min') minDate: any;
  @Input('max') maxDate: any;

  private el: any;
  private pickerInstance: any;

  onChange = (_: any) => {
  }
  onTouched = () => {
  }

  constructor(elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }

  ngOnInit() {
    let inputEl = $(this.el);
    inputEl.datetimepicker(this.getOptions());
    this.pickerInstance = inputEl.data('DateTimePicker');

    inputEl.on('dp.change', (event: any) => {
      this.onChange(event.date);
    });
  }

  ngOnDestroy() {
    $(this.el).off();
  }

  ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach(key => {
      if (changes[key].isFirstChange()) {
        return true;
      }
      let value = changes[key].currentValue;
      // Schedule update on next tick to avoid too many subsequent updates via minDate/maxDate options
      setTimeout(() => {
        if (key === 'datePicker' && value) {
          this.pickerInstance.options(value);
        } else if (key === 'minDate' && value) {
          this.pickerInstance.minDate(value);
        } else if (key === 'maxDate' && value) {
          this.pickerInstance.maxDate(value);
        }
      }, 0);
    });
  }

  writeValue(value: any): void {
    this.setDate(value);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private getOptions() {
    return Object.assign({
      format: 'MM/DD/YYYY',
      defaultDate: this.value,
      useCurrent: false,
      minDate: this.minDate,
      maxDate: this.maxDate,
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'glyphicon glyphicon-screenshot',
        clear: 'glyphicon glyphicon-trash',
        close: 'glyphicon glyphicon-remove'
      }
    }, this.options);
  }

  private setDate(date: any) {
    this.pickerInstance.date(date || null);
  }
}
