export interface RuleOperator {
  code: string;
  label: string;
}

export interface RuleOperatorGroup {
  [key: string]: RuleOperator[];
}

export interface GroupOperator {
  code: string;
  label: string;
}

export interface RuleField {
  field: string;
  label: string;
  type: string;
}

export interface RuleEntry {
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

export interface RuleGroup {
  operator: GroupOperator;
  rules: Array<RuleEntry | RuleGroup>;
}


