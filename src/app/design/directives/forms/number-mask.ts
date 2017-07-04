import { Directive, Renderer, ElementRef, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


class NumberMask {
  private maskInput: any;

  constructor(private inputEl: HTMLInputElement, maskConfig: any = {}) {
    let config = Object.assign({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      allowDecimal: true,
      decimalLimit: 2,
      allowNegative: true,
      integerLimit: 15
    }, maskConfig);

    let mask = createNumberMask(config);
    this.maskInput = this.createMaskInput(mask);
  }

  update(value: string) {
    this.maskInput.update(value);
  }

  createMaskInput(mask: any) {
    return createTextMaskInputElement(Object.assign({inputElement: this.inputEl}, {mask: mask}));
  }
}

@Directive({
  selector: '[numberMask]',
  host: {
    '(input)': 'onInput($event)',
    '(blur)': '_onTouched()'
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberMaskDirective),
    multi: true
  }]
})
export class NumberMaskDirective implements ControlValueAccessor {
  @Input('numberMask') maskConfig: any;

  private inputEl: HTMLInputElement;
  private lastValue: any;
  private numberMask: NumberMask;

  constructor(private renderer: Renderer, private element: ElementRef) {
  }

  ngOnInit() {
    this.setupMask();
  }

  setupMask() {
    this.inputEl = this.element.nativeElement;
    this.numberMask = new NumberMask(this.inputEl, this.maskConfig);
  }

  writeValue(value: any) {
    this.numberMask.update(value);
  }

  registerOnChange(fn: (value: any) => any): void {
    this._onChange = value => {
      let nv = value.split('.').map(v => v.replace(/[^0-9-]+/g, '')).join('.');
      nv = parseFloat(nv);
      fn(isNaN(nv) ? null : nv);
    };
  }

  registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  onInput($event) {
    this.numberMask.update($event.target.value);
    if (this.lastValue !== $event.target.value) {
      this.lastValue = $event.target.value;
      this._onChange($event.target.value);
    }
  }

  private _onTouched = () => {
  }
  private _onChange = (_: any) => {
  }
}
