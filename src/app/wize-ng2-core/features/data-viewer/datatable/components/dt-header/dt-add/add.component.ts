import { Component, Input, Output, OnChanges, OnInit, OnDestroy, EventEmitter } from '@angular/core'

@Component({
    selector: 'dt-add',
    templateUrl: './add.html',
    styles:['./add.scss']
})

export class AddComponent implements OnInit, OnChanges, OnDestroy{
    @Output() addRowEvent: EventEmitter<any> = new EventEmitter();

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    ngOnDestroy() {

    }

    addRow(){
        this.addRowEvent.emit(null);
    }

}