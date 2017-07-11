import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ConditionGroup, Condition } from '../../interfaces/filter-group';

@Component({
  selector: 'filter-group',
  templateUrl: 'filter-group.html',
  styleUrls: ['filter-group.scss']
})
export class FilterGroupComponent implements OnInit {

  @Input() conditionGroups: ConditionGroup[];
  @Input() showOperatorList: boolean;
  @Input() showRemoveGroupButton: boolean;
  @Input() tableList: string[];
  @Input() tablesDef: any;
  @Input() aggregateFields: any;
  @Input() modelsAndColumns: any;

  @ViewChild('whereFilter') whereFilter:FilterGroupComponent;
  @ViewChild('havingFilter') havingFilter:FilterGroupComponent;

  filtersMap: any;
  constructor() {

  }

  ngOnInit() {
    this.filtersMap = {
      "": [
        {name:"equals", value:"="}
      ],
      "DATE":[
        {name:"is before", value:"<="},
        {name:"is after",  value:">="},
        {name:"equals", value:"="},
        {name:"between", value:"><"},
        {name:"between or equal", value:">=<="}
      ],
      "BOOLEAN":[
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="}
      ],
      "ENUM":[
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="}
      ],
      "NUMBER":[
        {name:"exists", value:"EXIST"},
        {name:"does not exist", value:"NOT_EXIST"},
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="},
        {name:"less than", value:"<"},
        {name:"less than or equal", value:"<="},
        {name:"greater than", value:">"},
        {name:"greater than or equal", value:">="},
        {name:"between", value:">=<="}
      ],
      "FLOAT":[
        {name:"exists", value:"EXIST"},
        {name:"does not exist", value:"NOT_EXIST"},
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="},
        {name:"less than", value:"<"},
        {name:"less than or equal", value:"<="},
        {name:"greater than", value:">"},
        {name:"greater than or equal", value:">="},
        {name:"between", value:">=<="}
      ],
      "INTEGER":[
        {name:"exists", value:"EXIST"},
        {name:"does not exist", value:"NOT_EXIST"},
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="},
        {name:"less than", value:"<"},
        {name:"less than or equal", value:"<="},
        {name:"greater than", value:">"},
        {name:"greater than or equal", value:">="},
        {name:"between", value:">=<="}
      ],
      "DOUBLE":[
        {name:"exists", value:"EXIST"},
        {name:"does not exist", value:"NOT_EXIST"},
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="},
        {name:"less than", value:"<"},
        {name:"less than or equal", value:"<="},
        {name:"greater than", value:">"},
        {name:"greater than or equal", value:">="},
        {name:"between", value:">=<="}
      ],
      "STRING":[
        {name:"exists", value:"EXIST"},
        {name:"does not exist", value:"NOT_EXIST"},
        {name:"equals", value:"="},
        {name:"does not equal", value:"!="},
        {name:"starts with", value:"STARTS_WITH"},
        {name:"ends with", value:"ENDS_WITH"},
        {name:"contains", value:"CONTAINS"},
        {name:"does not contain", value:"NOT_CONTAINS"}
      ]
    };
  }

  addGroupConditionGroup(conditionGroup, isHavingClause) {
    let conditionGroup1 = new ConditionGroup();
    conditionGroup1.isHavingClause = isHavingClause;
    (isHavingClause)?conditionGroup.havingGroups.push(conditionGroup1):conditionGroup.conditionGroups.push(conditionGroup1);
  }

  addGroupCondition(conditionGroup) {
    let condition = new Condition();
    if(conditionGroup.conditions.length == 0)
      condition.showOperator = false;
    conditionGroup.conditions.push(condition);
  }

  removeGroupCondition(conditionGroup, child) {
    let index = conditionGroup.conditions.findIndex(condition => condition === child);
    if (index >= 0) {
      conditionGroup.conditions.splice(index, 1);
    }
  }

  removeGroupConditionGroup(conditionGroup) {
    if(conditionGroup.isHavingClause) {
      this.conditionGroups[0].havingGroups.splice(0, 1);
    } else {
      let index = this.conditionGroups.findIndex(group => group === conditionGroup);
      if (index >= 0) {
        this.conditionGroups.splice(index, 1);
      }
    }
  }

  onTableChange(event,condition){
    condition.column = "";
    condition.columnType = "";
    condition.conditionOperator = "";
    condition.value1 = "";
    condition.value2 = "";
  }

  onColumnChange(event,condition){
    const selectedOption = event.currentTarget.value;
    const field = this.tablesDef.find(f => f.id == selectedOption);
    condition.columnType = "";
    condition.conditionOperator = "";
    condition.value1 = "";
    condition.value2 = "";

    condition.columnType = field.dataType;
    condition.column = field.columnName;
    condition.table = field.modelName;
  }

  onAggColumnChange(event,condition){
    const selectedOption = event.currentTarget.value;
    const field = this.aggregateFields.find(f => f.id == selectedOption);
    condition.columnType = "";
    condition.conditionOperator = "";
    condition.value1 = "";
    condition.value2 = "";

    condition.columnType = field.dataType;
    condition.column = field.columnName;
    condition.table = field.modelName;
    condition.function = field.function;
  }

  onOperatorChange(event,condition){
    condition.value1 = "";
    condition.value2 = "";
  }

  changeOperator(obj){
    obj.operator = (obj.operator == 'AND') ? 'OR' : 'AND';
  }
}
