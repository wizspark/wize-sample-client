import { Component, Input, ViewChild, OnDestroy, Output, OnChanges, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms'
import { DataTableService } from './../../services/datatable.service';
import { Filter } from './../../interfaces/datatable.interface';
import { ModalComponent } from '../../../../modal/modal.component';

@Component({
    selector: 'filter',
    templateUrl: './filter.html',
    styleUrls: [ 'filter.scss' ],
    providers:[]
})


export class FilterComponent {
    @ViewChild('modal') modal: ModalComponent;
    @Input() name: string;
    @Output() applyFilterEvent: EventEmitter<any> = new EventEmitter();
    positiveClick: () => void;
    title: string = 'Add Record';
    showFilterModalSubscription: Subscription;
    data: any;
    formData: FormGroup;
    columns: any[] = [];
    filterList: any[] = [];
    operator: any = 'OR';
    filterQuery: any;
    constructor(
        private dataTableService: DataTableService) {
        this.showFilterModalSubscription = this.dataTableService.showFilterModal$.subscribe(
            item => {
                if(this.name === item.entityName)
                    this.activate(item);
            });
        this.filterList.push(new Filter(this.operator, '', '', '' ));
    }

    ngOnChanges(){
    }

    activate(data: any) {
        this.data = data;
        this.columns = this.data.customFormData.attributes;
        this.title = data.title;
        this.modal.show();
    }

    addUpdate(){
        this.positiveClick();
        this.modal.hide();
    }

    dismissed(){
        this.modal.hide();
        this.dataTableService.closeModal({});
    }

    onSubmit(event) {
        console.log(event)
    }

    onChanges(event) {
        this.formData = event;
        // Change Validation
        if(this.formData.valid){

        }
    }

    ngOnDestroy(){
        this.showFilterModalSubscription.unsubscribe();
    }

    getExpressionValue(expression, value){
        let sqlObj;
        switch (expression){
            case 'exists':
                sqlObj = {'$ne': null};
                break;
            case 'does not exist':
                sqlObj = {'$eq' : null };
                break;
            case 'equals':
                sqlObj = {'$eq' : value};
                break;
            case 'does not equal':
                sqlObj = {'$ne': value};
                break;
            case 'starts with':
                sqlObj = {'$iLike': `${value}%`};
                break;
            case 'ends with':
                sqlObj = {'$notILike': `%${value}`};
                break;
            case 'in':
                sqlObj = {'$in': value};
                break;
            case 'contains':
                sqlObj = {'$like': `%${value}%`};
                break;
            case 'does not contain':
                sqlObj = {'$notIn': value };
                break;

        }
        return sqlObj;
    }

    saveModel(){
        let query = {
            "$or": []
        };
        const sqlOperator = this.operator === 'OR' ? '$or' : '$and';
        query[sqlOperator] = [];
        this.filterList.forEach((f) => {
            if(f.operator && f.column && f.expression){
                let cq = {};
                cq[f.column] = this.getExpressionValue(f.expression, f.value);
                query[sqlOperator].push(cq);
            }
        });

        let event = {
            first: 0,
            rows: 10,
            query: query
        }

        //this.filterQuery = JSON.stringify(query);
        this.applyFilterEvent.emit(query);
        this.modal.hide();
    }

    addFilter(){
        this.filterList.push(new Filter(this.operator, '', '', '' ));
    }

    removeFilter(item){
        var index = this.filterList.indexOf(item, 0);
        if (index > -1) {
            this.filterList.splice(index, 1);
        }
    }

    operatorChanged(data){
        this.operator = data;
        this.filterList.forEach((filter) => { filter.operator = data });
    }

}