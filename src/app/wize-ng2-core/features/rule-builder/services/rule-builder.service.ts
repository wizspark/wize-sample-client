import { Injectable } from '@angular/core';
import {
  RuleOperator, RuleField, GroupOperator, RuleGroup, RuleEntry,
  RuleOperatorGroup
} from '../interfaces/rule-builder.interface';

@Injectable()
export class RuleBuilderService {
  private operators: RuleOperatorGroup = {
    'basic': [
      {code: '===', label: 'equals'},
      {code: '!==', label: 'not equals'},
    ],
    'string': [
      {code: 'in', label: 'in'},
      {code: 'not_in', label: 'not in'},
      {code: 'starts_with', label: 'starts With'},
      {code: 'ends_with', label: 'ends with'},
      {code: 'contains', label: 'contains'},
      {code: 'not_contains', label: 'not contains'}
    ],
    'number': [
      {code: '<', label: 'less than'},
      {code: '<=', label: 'less than or equal to'},
      {code: '>', label: 'greater than'},
      {code: '>=', label: 'greater than or equal to'},
    ]
  };

  private fields: RuleField[] = [
    {field: 'loanAmount', label: 'Loan Amount', type: 'number'},
    {field: 'propertyValue', label: 'Property Value', type: 'number'},
    {field: 'propertyUsageType', label: 'Property Usage Type', type: 'string'},
    {field: 'LTV', label: 'LTV', type: 'number'},
    {field: 'CLTV', label: 'CLTV', type: 'number'},
    {field: 'FICO', label: 'FICO', type: 'number'},
    {field: 'creditScore', label: 'Credit Score', type: 'number'},
    {field: 'propertyType', label: 'Property Type', type: 'string'},
    {field: 'propertyState', label: 'Property State', type: 'string'},
    {field: 'loanPurposeType', label: 'Loan Purpose Type', type: 'string'},
    {field: 'mortgageType', label: 'Mortgage Type', type: 'string'}
  ];

  private groupOperators: GroupOperator[] = [
    {code: '&&', label: 'AND'},
    {code: '||', label: 'OR'}
  ];

  getOperators(type: string): RuleOperator[] {
    return this.operators['basic'].concat(this.operators[type]);
  }

  getFields() {
    return this.fields;
  }

  getGroupOperators() {
    return this.groupOperators;
  }

  /**
   * Parse query string and generate RuleGroup object
   * @param query
   * @returns {any}
   */
  parseQuery(query: string): RuleGroup {
    let group = {operator: null, rules: []};
    query = query.replace(/loanFeature\./g, '');
    if (query) {
      let tokenQueue = this.tokenizeQuery(query);
      try {
        this.processNextTokenInQueue(tokenQueue, group);
      } catch (e) {
        console.log('Error occurred while parsing query');
        return null;
      }
    }
    let isValid = this.validateAndConvert(group);
    return isValid ? group : null;
  }

  /**
   * Generate query string given a RuleGroup object
   * @param ruleGroup
   * @returns {string|string}
   */
  generateQuery(ruleGroup: RuleGroup) {
    return this.getRuleGroupQuery(ruleGroup, true);
  }

  // ##############################################
  // ###### GENERATE QUERY FROM GROUP OBJECT ######
  // ##############################################

  private getRuleGroupQuery(ruleGroup: RuleGroup, isRoot?: boolean) {
    if (!ruleGroup.operator) {
      return '';
    }
    let query = '';
    let typeStr = ' ' + ruleGroup.operator.code + ' ';
    ruleGroup.rules.forEach(entry => {
      query += (query ? typeStr : '');
      if ((<RuleGroup>entry).rules) {
        query += this.getRuleGroupQuery(<RuleGroup>entry);
      } else {
        query += this.convertRuleEntryToString(<RuleEntry>entry);
      }
    });
    return isRoot ? query : ('(' + query + ')');
  }

  private convertRuleEntryToString(entry: RuleEntry) {
    if (!entry.field || !entry.operator) {
      return '';
    }
    let queryFragment;
    let valueStr = this.convertValueToString(entry);
    let fieldStr = 'loanFeature.' + entry.field.field;
    switch (entry.operator.code) {
      case 'in':
        queryFragment = valueStr + '.indexOf(' + fieldStr + ') > -1';
        break;
      case 'not_in':
        queryFragment = valueStr + '.indexOf(' + fieldStr + ') == -1';
        break;
      case 'starts_with':
        queryFragment = fieldStr + '.startsWith(' + valueStr + ')';
        break;
      case 'ends_with':
        queryFragment = fieldStr + '.endsWith(' + valueStr + ')';
        break;
      case 'contains':
        queryFragment = fieldStr + '.contains(' + valueStr + ')';
        break;
      case 'not_contains':
        queryFragment = '!' + fieldStr + '.contains(' + valueStr + ')';
        break;
      default:
        queryFragment = `${fieldStr} ${entry.operator.code} ${valueStr}`;
    }
    return queryFragment;
  }

  private convertValueToString(entry: RuleEntry) {
    if (entry.operator.code === 'in' || entry.operator.code === 'not_in') {
      return '[\'' + entry.value.replace(/\s*/g, '').split(',').join('\', \'') + '\']';
    }
    if (entry.field.type === 'number') {
      let val = parseFloat(entry.value);
      return isFinite(val) ? val : '';
    }
    return `'${entry.value}'`;
  }


  // #####################################################
  // ###### GENERATE GROUP OBJECT FROM QUERY STRING ######
  // #####################################################

  private tokenizeQuery(query: string) {
    let queue = [];
    for (let i = 0; i < query.length; i++) {
      let token = query[i];
      if (/\(/.test(token)) {
        queue.push('(');
      } else if (/\)/.test(token)) {
        queue.push(')');
      } else if (/&|\|/.test(token)) {
        queue.push(token === '&' ? '&&' : '||');
        i++;
      } else if (token !== ' ') {
        let str = this.getNextUntil(query, i, /[^&\|]*/);
        str = str.replace(/[\)\s]+$/, '');
        queue.push(str);
        i = i + str.length - 1;
      }
    }
    return queue;
  }

  private processNextTokenInQueue(tokenQueue: string[], group: any) {
    let token = tokenQueue.shift();
    if (token === '&&' || token === '||') {
      group.operator = token;
      token = tokenQueue.shift();
    }

    if (token === '(') {
      let newGroup = {operator: null, rules: []};
      this.processNextTokenInQueue(tokenQueue, newGroup);
      group.rules.push(newGroup);
    } else if (token === ')') {
      return;
    } else {
      let {field, operator, value} = this.parseCondition(token);
      if (field && operator) {
        group.rules.push({field, operator, value});
      } else {
        throw new Error('Parsing Exception');
      }
    }

    if (tokenQueue.length !== 0) {
      this.processNextTokenInQueue(tokenQueue, group);
    }
  }

  private getNextUntil(query: string, index: number, regexp: RegExp) {
    let match = query.substring(index).match(regexp);
    return match && match[0];
  }

  private parseCondition(condition: string): any {
    if (condition === 'true' || condition === 'false') {
      return condition;
    } else {
      let matchTokens = condition.match(/(!)?\(?(.+)\.(indexOf|startsWith|endsWith|contains)\(([^\)]+)\)?(\s*(>|==|===|>=)\s*(-1|0))?\)?/);
      if (matchTokens && matchTokens.length > 1) {
        let method = matchTokens[3];
        let field, value, operator;
        switch (method) {
          case 'indexOf':
            field = matchTokens[4];
            value = matchTokens[2].replace(/^\[|\]$/g, '');
            if (matchTokens[6] === '>' || matchTokens[6] === '>=') {
              operator = 'in';
            } else {
              operator = 'not_in';
            }
            if (matchTokens[1] === '!') {
              operator = operator === 'in' ? 'not_in' : 'in';
            }
            break;

          case 'startsWith':
          case 'endsWith':
            field = matchTokens[2];
            value = matchTokens[4];
            operator = method === 'startsWith' ? 'starts_with' : 'ends_with';
            break;

          case 'contains':
            field = matchTokens[2];
            value = matchTokens[4];
            operator = matchTokens[1] === '!' ? 'not_contains' : 'contains';
            break;
          default:
            break;
        }
        value = this.cleanValue(value);
        return {field, operator, value};
      }
    }

    let tokens = condition.split(' ');
    let field = tokens.shift();
    let operator = tokens.shift();
    let value = tokens.join(' ');
    return {field, operator, value};
  }

  private cleanValue(value: string) {
    value = value || '';
    return value.replace(/['"]/g, '')
  }

  /**
   * Utility method to fill in RuleField and RuleOperator objects in place of corresponding string codes.
   * If no corresponding operator found then flag error
   * @param group
   * @returns {boolean}
   */
  private validateAndConvert(group: any): boolean {
    let isValid = true;
    group.operator = group.operator || '&&';
    this.groupOperators.forEach(operator => {
      if (group.operator === operator.code) {
        group.operator = operator;
        return false;
      }
    });

    group.rules.forEach(item => {
      if (item.rules) {
        isValid = isValid && this.validateAndConvert(item);
      } else {
        this.fields.forEach(field => {
          if (field.field === item.field) {
            item.field = field;
            return false;
          }
        });

        if (item.field && item.field.type) {
          this.getOperators(item.field.type).forEach(operator => {
            if (operator.code === item.operator) {
              item.operator = operator;
              return false;
            }
          });
        } else {
          isValid = false;
        }
        // check if field and operator are RuleField and RuleOperator objects
        isValid = (isValid && !!item.field.field && !!item.operator.code);
      }
    });
    return isValid;
  }
}
