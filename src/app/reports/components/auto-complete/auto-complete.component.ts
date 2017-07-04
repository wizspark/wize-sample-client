import {Component, OnInit, ElementRef, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-auto-complete',
  host: {
    '(document:click)': 'handleClick($event)',
  },
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {

  @Input() fieldName: string;
  @Input() options: string[];
  @Input() required: boolean = false;
  @Input() selectedColumns: string[];

  requiredEdit: boolean = false;

  @Output() notify: EventEmitter<string[]> = new EventEmitter<string[]>();

  query = '';
  filteredList = [];
  elementRef;

  constructor(myElement: ElementRef) {
    this.elementRef = myElement;
  }

  ngOnInit() {
    this.requiredEdit = this.required;
  }

  filter() {
    this.filteredList = this.options.filter(function(el){
      return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
    }.bind(this));
  }

  select(item){
    this.selectedColumns.push(item);
    this.query = '';
    this.filteredList = [];
    this.options.splice(this.options.indexOf(item),1);
    this.notify.emit(this.selectedColumns);
    if(this.required && this.selectedColumns.length > 0) {
      this.requiredEdit = false;
    } else if(this.required && this.selectedColumns.length <= 0) {
      this.requiredEdit = true;
    }
  }

  remove(item){
    this.options.push(item);
    this.options.sort();
    this.selectedColumns.splice(this.selectedColumns.indexOf(item),1);
    this.notify.emit(this.selectedColumns);
    if(this.required && this.selectedColumns.length > 0) {
      this.requiredEdit = false;
    } else if(this.required && this.selectedColumns.length <= 0) {
      this.requiredEdit = true;
    }
  }

  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(!inside){
      this.filteredList = [];
    }
  }

}
