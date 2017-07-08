import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter, QueryList, TemplateRef } from '@angular/core';
import { PrimeTemplate } from 'primeng/components/common/shared';

@Component({
  selector: 'dt-header',
  templateUrl: './header.html',
  styleUrls: ['header.scss']
})

export class HeaderComponent implements OnChanges, OnDestroy {
  @Input() name: string;
  @Input() entity: any;
  @Input() columns: any[];
  @Input() headerOptions: any = {};
  @Input() templates: QueryList<PrimeTemplate>;
  @Output() resetColumnsEvent: EventEmitter<any> = new EventEmitter();
  @Output() updateColumnsEvent: EventEmitter<any> = new EventEmitter();
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  @Output() addRowEvent: EventEmitter<any> = new EventEmitter();
  @Output() importEvent: EventEmitter<any> = new EventEmitter();
  @Output() exportEvent: EventEmitter<any> = new EventEmitter();
  @Output() filterEvent: EventEmitter<any> = new EventEmitter();
  @Output() runRulesEvent: EventEmitter<any> = new EventEmitter();
  customHeaderActionTemplate: TemplateRef<any>;
  pageInfoTemplate: TemplateRef<any>;

  constructor() {

  }

  ngOnChanges() {
  }

  ngOnDestroy() {

  }

  ngAfterContentInit() {
    if(this.templates) {
      this.templates.forEach((item) => {
        switch (item.getType()) {
          case 'customHeaderAction':
            this.customHeaderActionTemplate = item.template;
            break;

          case 'pageInfo':
            this.pageInfoTemplate = item.template;
            break;
        }
      });
    }
  }

  search(data) {
    this.searchEvent.emit(data);
  }

  updateColumns(data) {
    this.updateColumnsEvent.emit(data);
  }

  resetColumns(data) {
    this.resetColumnsEvent.emit(data);
  }

  importData(data) {
    this.importEvent.emit(data);
  }

  exportData(data) {
    this.exportEvent.emit(data);
  }

  addRow(data) {
    this.addRowEvent.emit(data);
  }

  filter(data) {
    this.filterEvent.emit(data);
  }

  runRules(){
    this.runRulesEvent.emit();
  }
}
