import { Component, forwardRef, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as CodeMirror from 'codemirror'


@Component({
  selector: 'code-editor',
  template: '<textarea #host></textarea>',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodeEditorComponent),
    multi: true
  }],
  styles: [`
    :host {display: block;}
    :host /deep/ .CodeMirror {
      border: 1px solid #eee;
    }
    :host(.height-auto) /deep/ .CodeMirror {
      height: auto;
    }
   `]
})
export class CodeEditorComponent implements ControlValueAccessor {
  @Input('config') _config: any;
  @Output() change = new EventEmitter();
  @ViewChild('host') host: any;
  instance: any;

  get value(): string {
    return this._value;
  };

  @Input() set value(v: string) {
    this._value = v;
    this._onChange(v);
  };

  private _value: string = '';
  private ternServer: any;

  private get config() {
    return Object.assign({
      lineNumbers: true,
      lineWrapping: true,
      readOnly: false,
      smartIndent: true,
      showCursorWhenSelecting: true,
      gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      mode: {name: 'javascript', globalVars: true},
      autofocus: false,
      viewportMargin: Infinity
    }, this._config);
  }

  ngOnInit() {
    this.codeMirrorInit(this.config);
  }

  ngAfterViewInit() {
    this.codeMirrorInit(this.config);
  }

  codeMirrorInit(config) {
    if (this.instance) return;
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);
    this.instance.on('change', () => {
      this.updateValue(this.instance.getValue());
    });
  }

  updateValue(value) {
    this.value = value;
    this._onTouched();
    this.change.emit(value);
  }

  writeValue(value) {
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
      setTimeout(() => {
        this.instance.refresh();
      }, 250);
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private _onChange(_: any) {
  }

  private _onTouched() {
  }
}
