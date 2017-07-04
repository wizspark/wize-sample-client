import { Component, Input, Output, OnChanges, OnInit, OnDestroy, EventEmitter } from '@angular/core'

@Component({
    selector: 'dt-search',
    templateUrl: './search.html',
    styles:['search.scss']
})

export class SearchComponent implements OnInit, OnChanges, OnDestroy{
    @Output() searchEvent: EventEmitter<any> = new EventEmitter();
    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    ngOnDestroy() {

    }

    search(event) {
        const searchedtext = event.currentTarget.value;
        this.searchEvent.emit(searchedtext);
    }

}