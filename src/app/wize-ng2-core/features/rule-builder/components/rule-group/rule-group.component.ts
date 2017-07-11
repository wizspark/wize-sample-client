import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RuleGroup, RuleField, GroupOperator, RuleOperator, RuleEntry } from '../../interfaces/rule-builder.interface';
import { RuleBuilderService } from '../../services/rule-builder.service';

@Component({
  selector: 'rule-group',
  templateUrl: 'rule-group.html',
  styleUrls: ['rule-group.scss']
})
export class RuleGroupComponent implements OnInit {
  @Input() group: RuleGroup;
  @Input() rootLevel: boolean;
  @Input() fields: RuleField[];

  @Output('delete') deleteEmitter = new EventEmitter<boolean>();
  @Output('change') changeEmitter = new EventEmitter<boolean>();

  groupOperators: GroupOperator[];

  constructor(private ruleBuilder: RuleBuilderService) {
  }

  ngOnInit() {
    this.groupOperators = this.ruleBuilder.getGroupOperators();
    if (this.group.rules.length === 0) {
      this.addCondition();
    }
  }

  getFieldOperators(field: RuleField) : RuleOperator[] {
    if (!field) {
      return [];
    }
    return this.ruleBuilder.getOperators(field.type);
  }

  addCondition() {
    this.group.rules.push(<RuleEntry> {
      field: null,
      operator: null,
      value: ''
    });
    this.onValueChange();
  }

  addGroup() {
    this.group.rules.push(<RuleGroup> {
      operator: this.ruleBuilder.getGroupOperators()[0],
      rules: []
    });
    this.onValueChange();
  }

  onRemoveChild(child: RuleGroup | RuleEntry) {
    let index = this.group.rules.findIndex(rule => rule === child);
    if (index >= 0) {
      this.group.rules.splice(index, 1);
    }
    this.onValueChange();
  }

  removeGroup() {
    this.deleteEmitter.emit(true);
    this.onValueChange();
  }

  onValueChange() {
    this.changeEmitter.emit(true);
  }
}
