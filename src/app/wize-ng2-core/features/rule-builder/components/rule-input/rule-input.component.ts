import { Component, ViewChild, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterBuilderService } from '../../services/filter-builder.service';
import { RuleBuilderService } from '../../services/rule-builder.service';
import { RuleGroup, RuleField } from '../../interfaces/rule-builder.interface';

@Component({
  selector: 'rule-input-control',
  templateUrl: 'rule-input.html',
  styleUrls:['rule-input.scss'],
})
export class RuleInputControlComponent implements OnInit, OnChanges {
  @Input() entity:any;
  @Input() query:any;
  @Input() form:any;
  @Input() showRunRule: boolean = true;
  group:RuleGroup;
  fields:RuleField[];
  @Output() runRuleEvent: EventEmitter<any> = new EventEmitter();
  @Output() ruleQueryGenerateEvent: EventEmitter<any> = new EventEmitter();
  constructor(private ruleBuilder:RuleBuilderService) {
  }

  mapFactAttributes() {
    let fields = [];
    if (this.entity.factSchema) {
      this.entity.factSchema.attributes.forEach((attr) => {
        fields.push({field: attr.name, label: attr.displayName, type: attr.type});
      });
    }
    return fields;
  }

  ngOnInit() {
    this.group = {operator: this.ruleBuilder.getGroupOperators()[0], rules: []};
    if(this.query) {
      this.group = this.ruleBuilder.parseQuery(this.query);
    }
    this.fields = this.mapFactAttributes();
  }

  ngOnChanges(){
    this.group = {operator: this.ruleBuilder.getGroupOperators()[0], rules: []};
    if(this.query) {
      this.group = this.ruleBuilder.parseQuery(this.query);
    }
    this.fields = this.mapFactAttributes();
  }


  createNewRule() {
    this.group = {operator: this.ruleBuilder.getGroupOperators()[0], rules: []};
  }

  activate(query:string) {
    this.query = query;
    this.group = this.ruleBuilder.parseQuery(query);
    return new Promise<string>(resolve => {
    });
  }

  getRuntimeQuery() {
    const queryResult = this.group ? this.ruleBuilder.generateQuery(this.group) : '';
    this.ruleQueryGenerateEvent.emit(queryResult);
    return queryResult;
  }

  save() {
    this.query = this.group ? this.ruleBuilder.generateQuery(this.group) : this.query;
  }

  runRules(){
    this.runRuleEvent.emit(this.form);
  }
}
