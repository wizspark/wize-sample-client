import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { defaultTimeSelectors } from './time-selectors';

/**
 * Date Selector component
 *  This component does not support changes in @Input() values after initialization
 */

@Component({
  selector: 'date-range-selector',
  templateUrl: 'date-range-selector.html',
  styleUrls: ['date-range-selector.scss']
})
export class DateRangeSelectorComponent {
  @Input() fromDate: any;
  @Input() toDate: any;
  @Input() timeSelectors: any[];
  @Input() selector: any;
  @Input() dateFormat: any;

  @Output() dateRangeChange = new EventEmitter<{from: Date, to: Date}>();

  ngOnInit() {
    if (!this.timeSelectors) {
      this.timeSelectors = defaultTimeSelectors;
    }
    if (!this.dateFormat) {
      this.dateFormat = 'MM-DD-YYYY';
    }
    this.initSelector();
  }

  formatDate(dateString: string) {
    return moment(dateString).format(this.dateFormat);
  }

  applySelector(selector) {
    this.setSelector(selector);
    this.dateRangeChange.emit({from: this.fromDate, to: this.toDate});
  }

  apply() {
    this.setSelector(null);
    this.dateRangeChange.emit({from: this.fromDate, to: this.toDate});
  }

  clear() {
    this.applySelector(this.timeSelectors[3]);
  }

  isSelected(selector) {
    if (this.selector) {
      return selector.value === this.selector.value;
    }
  }

  private initSelector() {
    if (!this.selector && !this.fromDate && !this.toDate) {
      //this.applySelector(this.timeSelectors[3]);
    } else if (this.selector) {
      this.applySelector(this.selector);
    }
  }

  private setSelector(selector) {
    this.selector = selector;
    if (selector) {
      this.fromDate = DateRangeSelectorComponent.parseTimePatterns(selector.range.from);
      this.toDate = DateRangeSelectorComponent.parseTimePatterns(selector.range.to);
    }
  }

  private static parseTimePatterns(value) {
    let tokens = /(now|eod|sod)(?:((?:-|\+)[0-9]+)([YMdhms]))*/.exec(value) || [],
      time;
    if (tokens[1] === 'now') {
      time = moment();
    }
    if (tokens[1] === 'sod') {
      time = moment().startOf('day');
    }
    if (tokens[1] === 'eod') {
      time = moment().endOf('day');
    }
    if (tokens[2] && tokens[3]) {
      time.add(+tokens[2], tokens[3]);
    }
    return (time && time.toDate()) || value;
  }
}
