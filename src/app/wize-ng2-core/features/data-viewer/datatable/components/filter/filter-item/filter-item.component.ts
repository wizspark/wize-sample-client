import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms'
import { DataTableService } from './../../../services/datatable.service';

@Component({
    selector: 'filter-item',
    templateUrl: './filter-item.html',
    styleUrls: [ './filter-item.scss' ],
    providers:[]
})


export class FilterItemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() filter: any;
    @Input() index: number;
    @Input() columns: any[] = [];
    @Input() totalCount: number;
    @Output() removeFilterEvent = new EventEmitter();
    @Output() addFilterEvent = new EventEmitter();
    @Output() filterChangeEvent = new EventEmitter();
    @Output() operatorChangeEvent = new EventEmitter();
    showAddButton: boolean = false;
    filterQuery: any;
    operator: string = 'OR';
    filters: Array<any> = [
        {
            'type': 'DATE',
            'filters': [
                'exists',
                'does not exist',
                'is before',
                'is after'
            ]
        },
        {
            'type': 'BOOLEAN',
            'filters': [
                'exists',
                'does not exist',
                'equals'
            ]
        },
        {
            'type': 'enum',
            'filters': [
                'equals',
                'does not equal'
            ]
        },
        {
            'type': 'array',
            'filters': [
                'exists',
                'does not exist',
                'contains string',
                'without string',
                'contains number',
                'without number'
            ]
        },
        {
            'type': 'number',
            'filters': [
                'exists',
                'does not exist',
                'equals',
                'does not equal',
                'less than',
                'less than or equal',
                'greater than',
                'greater than or equal'
            ]
        },
        {
            'type': 'FLOAT',
            'filters': [
                'exists',
                'does not exist',
                'equals',
                'does not equal',
                'less than',
                'less than or equal',
                'greater than',
                'greater than or equal'
            ]
        },
        {
            'type': 'INTEGER',
            'filters': [
                'exists',
                'does not exist',
                'equals',
                'does not equal',
                'less than',
                'less than or equal',
                'greater than',
                'greater than or equal'
            ]
        },
        {
            'type': 'STRING',
            'filters': [
                'exists',
                'does not exist',
                'equals',
                'does not equal',
                'starts with',
                'ends with',
                'in',
                'contains',
                'does not contain'
            ]
        },
        {
            'type': 'hasMany',
            'filters': [
                'exists',
                'does not exist'
            ]
        },
        {
            'type': 'hasone',
            'filters': [
                'exists',
                'does not exist'
            ]
        },
        {
            'type': 'JSONB',
            'filters': [
                'exists',
                'does not exist'
            ]
        },
        {
            'type': 'url',
            'filters': [
                'exists',
                'does not exist'
            ]
        },
        {
            'type': 'WIZE_CODE',
            'filters': [
                'exists',
                'does not exist'
            ]
        },
        {
            'type': 'id',
            'filters': [
                'equals',
                'does not equal'
            ]
        },
    ];
    constructor(){

    }

    ngOnInit(){
        this.showAddButton = (this.index === this.totalCount);
        this.operator = this.filter.operator;
    }

    ngOnChanges(){
        this.showAddButton = (this.index === this.totalCount);
        this.filterChangeEvent.emit(this.filterQuery);
    }

    ngOnDestroy(){
        this.removeFilterEvent.emit(this.filter);
    }

    removeFilter(){
        this.removeFilterEvent.emit(this.filter);
    }

    addFilter(){
        this.addFilterEvent.emit();
    }

    getFilters(type){
        return this.filters.find((f) => { return f.type === type}).filters;
    }

    changeOperator(){
        this.operator = (this.operator == 'AND') ? 'OR' : 'AND';
        this.operatorChangeEvent.emit(this.operator);
    }
}