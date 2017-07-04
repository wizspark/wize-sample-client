export class FilterGroup {

  constructor() {
    let conditionGroup = new ConditionGroup();
    this.conditionGroups.push(conditionGroup);
  }

  reset() : void {
    this.conditionGroups = [];
    let conditionGroup = new ConditionGroup();
    this.conditionGroups.push(conditionGroup);
  }

  conditionGroups: ConditionGroup[] = [];

  toString(): string {
    let str = "";
    for(let i=0;i <this.conditionGroups.length; i++) {
      str += this.conditionGroups[i].toString();
    }
    return str;
  }
}

export class PivotGroup {

  constructor() {
    let conditionGroup = new ConditionGroup();
    conditionGroup.conditions = [];
    conditionGroup.isDuper = true;
    let subConditionGroup = new ConditionGroup();
    subConditionGroup.isSuper = true;
    conditionGroup.conditionGroups.push(subConditionGroup);
    this.conditionGroups.push(conditionGroup);
  }

  reset() : void {
    this.conditionGroups = [];
    let conditionGroup = new ConditionGroup();
    conditionGroup.isParent = true;
    conditionGroup.isSuper = true;
    this.conditionGroups.push(conditionGroup);
  }

  conditionGroups: ConditionGroup[] = [];

  toString(): string {
    let str = "";
    for(let i=0;i <this.conditionGroups.length; i++) {
      str += this.conditionGroups[i].toString();
    }
    return str;
  }
}

export class Condition {

  constructor() {
    this.operator = "AND";
  }

  showOperator: boolean = true;
  index: number = 0;
  operator: string = "";
  table: string = "";
  column: string = "";
  columnType: string = "";
  conditionOperator: string = "";
  value1: any = "";
  value2: any = "";
  label: any = "";
  function: any = "";

  toString(): string {
    return "(" + this.table + "." + this.column + " " + this.conditionOperator + " " + this.value1 + (this.value2? ", " + this.value2:" ") + (this.label? " AS " + this.label:"") + ")";
  }
}

export class ConditionGroup {

  index: number = 0;
  operator: string = "";
  conditions: Condition[] = [];
  conditionGroups: ConditionGroup[] = [];
  havingGroups: ConditionGroup[] = [];
  isDuper: boolean = false;
  isSuper: boolean = false;
  isParent: boolean = false;
  isHavingClause: boolean = false;

  constructor() {
    this.operator = "AND";
    let condition = new Condition();
    condition.showOperator = false;
    this.conditions.push(condition);
  }

  toString(): string {
    let str = "(";
    for(let i=0;i <this.conditions.length; i++) {
      str += this.conditions[i].toString() + (i != this.conditions.length-1?" " + this.conditions[i+1].operator + " ":"");
    }

    if(this.conditions.length > 0 && this.conditionGroups.length > 0) {
      str += " " + this.conditionGroups[0].operator + " ";
    }

    for(let i=0;i <this.conditionGroups.length; i++) {
      str += this.conditionGroups[i].toString() + (i != this.conditionGroups.length-1?(i != this.conditionGroups.length-1):"");
    }
    str += ")";
    return str;
  }
}
