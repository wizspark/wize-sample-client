import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'filter-text',
  templateUrl: './filter-text.html'
})

export class FilterTextComponent implements OnInit {
  @Input() public placeholder: string;
  @Output() public changed: EventEmitter<string>;
  public filter: string;

  constructor() {
    this.changed = new EventEmitter<string>();
  }

  public clear() {
    this.filter = '';
  }

  public filterChanged(event: any) {
    event.preventDefault();
    this.changed.emit(this.filter);
  }

  public ngOnInit() {
    this.placeholder = this.placeholder ? this.placeholder : 'Search';
  }
}
