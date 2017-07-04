export class Query {
  models: string[] = [];
  relations: any[] = [];
  columns: string[] = [];
  metrics: any[] = [];
  groupby: string[] = [];
  filters: any[] = [];
  pivots: any[] = [];
  tableDisplayColumns: any;
}

export interface ReportQueryConditionGroups {
  [key: string]: any
}

export interface ReportQueryConditions {
  [key: string]: any
}
