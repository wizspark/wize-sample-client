import { Injectable } from '@angular/core';
import { RuleGroup, RuleEntry, GroupOperator, RuleField } from '../interfaces/rule-builder.interface';
import * as moment from 'moment';

@Injectable()
export class FilterBuilderService {
  private operators: any = {
      'STRING': [
        'exists',
        'does not exist',
        'equals',
        'does not equal',
        'starts with',
        'ends with',
        'in',
        'contains',
        'does not contain'
      ],
      'number': [
        'exists',
        'does not exist',
        'equals',
        'does not equal',
        'less than',
        'less than or equal',
        'greater than',
        'greater than or equal'
      ],
      'INTEGER': [
        'exists',
        'does not exist',
        'equals',
        'does not equal',
        'less than',
        'less than or equal',
        'greater than',
        'greater than or equal'
      ],
      'DECIMAL': [
        'exists',
        'does not exist',
        'equals',
        'does not equal',
        'less than',
        'less than or equal',
        'greater than',
        'greater than or equal'
      ],
      'FLOAT': [
        'exists',
        'does not exist',
        'equals',
        'does not equal',
        'less than',
        'less than or equal',
        'greater than',
        'greater than or equal'
      ],
      'BOOLEAN': [
        'exists',
        'does not exist',
        'equals'
      ],
      'DATE': [
        'exists',
        'does not exist',
        'is before',
        'is after'
      ],
      'WIZE_CODE': [
        'exists',
        'does not exist'
      ],
      'JSONB': [
        'exists',
        'does not exist'
      ],
      'array': [
        'exists',
        'does not exist',
        'contains string',
        'without string',
        'contains number',
        'without number'
      ],
      'enum': [
        'equals',
        'does not equal'
      ],
      'hasMany': [
        'exists',
        'does not exist'
      ],
      'hasOne': [
        'exists',
        'does not exist'
      ],
      'url': [
        'exists',
        'does not exist'
      ],
      'id': [
        'equals',
        'does not equal'
      ]
    };

  private groupOperators: GroupOperator[] = [{code: '$and', label: 'AND'}, {code: '$or', label: 'OR'}];

  getOperators(type: string): any[] {
    return (this.operators[type] || []).map(op => {
      return { code: op, label: op};
    });
  }

  getGroupOperators() : GroupOperator[] {
    return this.groupOperators;
  }

  generateFilterQuery(group: RuleGroup) {
    return this.getGroupQuery(group);
  }

  readFilterQuery(query: any, fields: RuleField[]) {
    let group = {operator: null, rules: []};
    this.parseFilterQuery(query, group, fields);
    return group;
  }

  private parseFilterQuery(query: any, group: any, fields: RuleField[]) {
    let conditions = [];
    if (query.$or) {
      group.operator = this.getGroupOperators()[1];
      conditions = query.$or;
    } else if (query.$and) {
      group.operator = this.getGroupOperators()[0];
      conditions = query.$and;
    }

    conditions.forEach(condition => {
      group.rules.push(this.parseFilterCondition(condition, group, fields))
    });
  }

  private parseFilterCondition(condition: any, group: any, fields: RuleField[]) {
    Object.keys(condition).forEach(key => {
      if (key === '$or' || key === '$and') {
        let newGroup = {operator: this.getGroupOperators()[key === '$and' ? 0 : 1]};
        this.parseFilterQuery(condition, newGroup, fields);
        group.rules.push(newGroup);
      } else {
        let field = fields.find(item => item.field === key);
        let operator,
          value;

        if (field) {
          Object.keys(condition[key]).forEach(opKey => {
            value = condition[key][opKey];
            switch (opKey) {
              case '$eq':
                if (value === null) {
                  operator = this.getOperator(field.type, 'does not exists');
                } else {
                  operator = this.getOperator(field.type, 'equals');
                }
                break;
              case '$ne':
                if (value === null) {
                  operator = this.getOperator(field.type, 'exists');
                } else {
                  operator = this.getOperator(field.type, 'does not equal');
                }
                break;
              case '$lte':
                if (field.type === 'DATE') {
                  operator = this.getOperator(field.type, 'is before');
                } else {
                  operator = this.getOperator(field.type, 'less than or equal');
                }
                break;
              case '$lt':
                operator = this.getOperator(field.type, 'less than');
                break;
              case '$gte':
                if (field.type === 'DATE') {
                  operator = this.getOperator(field.type, 'is after');
                } else {
                  operator = this.getOperator(field.type, 'greater than or equal');
                }
                break;
              case '$gt':
                operator = this.getOperator(field.type, 'greater than');
                break;
              case '$in':
                operator = this.getOperator(field.type, 'in');
                break;
              default:
                break;
            }
            group.rules.push({field, operator, value});
          });
        }
      }
    });
  }

  private getOperator(type: string, code: string) {
    return this.getOperators(type).find(op => op.code === code);
  }

  private getGroupQuery(group: RuleGroup) {
    if (!group.operator) {
      return {};
    }

    let conditions = [];
    let query = { [group.operator.code]: conditions };

    group.rules.forEach(entry => {
      if ((<RuleGroup>entry).rules) {
        conditions.push(this.getGroupQuery(<RuleGroup>entry))
      } else {
        conditions.push(this.getRuleQuery(<RuleEntry>entry));
      }
    });

    return query;
  }

  private getRuleQuery(rule: RuleEntry) {
    let op = null,
      value = null;
    switch (rule.operator.code) {
      case 'equals':
        op = '$eq';
        value = rule.value;
        break;
      case 'does not equal':
        op = '$ne';
        value = rule.value;
        break;
      case 'exists':
        op = '$ne';
        value = null;
        break;
      case 'does not exist':
        op = '$eq';
        value = null;
        break;
      case 'is before':
        op = '$lte';
        value = moment(rule.value).endOf('day').toDate();
        break;
      case 'is after':
        op = '$gte';
        value = moment(rule.value).startOf('day').toDate();
        break;
      case 'contains string':
      case 'contains number':
      case 'contains':
        op = '$iLike';
        value = ['%', rule.value, '%'].join('');
        break;
      case 'without string':
      case 'without number':
      case 'does not contain':
        op = '$notILike';
        value = ['%', rule.value, '%'].join('');
        break;
      case 'less than':
        op = '$lt';
        value = rule.value;
        break;
      case 'less than or equal':
        op = '$lte';
        value = rule.value;
        break;
      case 'greater than':
        op = '$gt';
        value = rule.value;
        break;
      case 'greater than or equal':
        op = '$gte';
        value = rule.value;
        break;
      case 'starts with':
        op = '$iLike';
        value = [rule.value, '%'].join('');
        break;
      case 'ends with':
        op = '$iLike';
        value = ['%', rule.value].join('');
        break;
      case 'in':
        op = '$in';
        value = this.getArrayValue(rule);
        break;
      default:
        break;
    }
    if (op) {
      let field = rule.field.field;
      return {[field]: {[op]: value}};
    }
    return {};
  }

  private getArrayValue(item: any) {
    let that = this; // fool tslint
    if (typeof item.value === 'string') {
      let array = (item.value) ? item.value.replace('[', '').replace(']', '').split(',') : [];
      return array.map(item => item.trim());
    } else {
      return item.value;
    }
  }
}
