import { Component, Input, Output, OnChanges, OnInit, OnDestroy, EventEmitter } from '@angular/core'

@Component({
    selector: 'dt-filter',
    templateUrl: './filter.html',
    styles:['./filter.scss']
})

export class HeaderFilterComponent implements OnInit, OnChanges, OnDestroy{
    @Output() filterEvent: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    ngOnDestroy() {

    }

    filter(){
        this.filterEvent.emit(null);
    }

}