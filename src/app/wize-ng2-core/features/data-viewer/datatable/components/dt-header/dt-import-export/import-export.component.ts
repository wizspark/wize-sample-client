import { Component, Input, Output, OnChanges, OnInit, OnDestroy, EventEmitter } from '@angular/core'

@Component({
    selector: 'dt-import-export',
    templateUrl: './import-export.html',
    styleUrls:['./import-export.scss']
})

export class ImportExportComponent implements OnInit, OnChanges, OnDestroy{
    @Input() noImport: boolean;
    @Input() noExport: boolean;
    @Output() importEvent: EventEmitter<any> = new EventEmitter();
    @Output() exportEvent: EventEmitter<any> = new EventEmitter();
    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {

    }

    ngOnDestroy() {

    }

    import(){
        this.importEvent.emit(null);
    }

    export(){
        this.exportEvent.emit(null);
    }

}
