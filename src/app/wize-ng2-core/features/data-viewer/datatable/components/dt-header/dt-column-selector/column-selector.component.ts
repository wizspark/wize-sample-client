import { Component, Input, Output, OnChanges, OnInit, OnDestroy, EventEmitter } from '@angular/core'

@Component({
    selector: 'dt-column-selector',
    templateUrl: './column-selector.html',
    styleUrls:['./column-selector.scss']
})

export class ColumnSelectorComponent implements OnInit, OnChanges, OnDestroy{
    @Input() columns: any[] = [];
    @Output() resetColumnsEvent: EventEmitter<any> = new EventEmitter();
    @Output() updateColumnsEvent: EventEmitter<any> = new EventEmitter();
    open: any = null;
    constructor() {

    }

    ngOnInit() {
    }

    ngOnChanges() {

    }

    ngOnDestroy() {

    }

    updateColumns() {
        this.updateColumnsEvent.emit(this.columns.filter((c) => { return c.viewOptions.noView === false }));
        this.open = false;
    }

    resetColumns() {
        //Send Filtered Columns
        this.resetColumnsEvent.emit();
        this.open = false;
    }

    updateColumnStatus(column, event){

        this.columns.find((col) => { return col === column}).viewOptions.noView = !event.currentTarget.checked;
    }

    isOpen(){
        return (this.open == null || !this.open) ? false: true;
    }

}