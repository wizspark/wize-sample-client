import { FilterGroup, PivotGroup } from '../interfaces/filter-group';

export class QuerySelector {

  reset() : void {
    this.modelName= "";
    this.relationTables = [];
    this.displayColumns = [];
    this.selectedColumns = [];
    this.filterGroup = new FilterGroup();
    this.pivotGroup = new PivotGroup();
    this.pivotGroup.conditionGroups[0].conditions[0].showOperator = true;
    this.pivotGroup.conditionGroups[0].conditions[0].conditionOperator = "WHEN";
    this.selectedRelationColumns = {};
    this.selectGroups = [];
    this.selectMetrics = [];
  }

  modelName: string = "";
  relationTables: string[] = [];
  selectedRelationColumns: any;
  selectedColumns: string[] = [];
  displayColumns: string[] = [];
  selectGroups: string[] = [];
  selectMetrics: string[] = [];
  filterGroup: FilterGroup = new FilterGroup();
  pivotGroup: FilterGroup = new PivotGroup();
}
