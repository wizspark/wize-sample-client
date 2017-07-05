import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { FilterModalService } from '../filter-modal/filter-modal.service';
import { PivotModalService } from '../pivot-modal/pivot-modal.service';
import { FilterGroup, PivotGroup } from '../../interfaces/filter-group';
import { Query } from '../../interfaces/query';

@Component({
  selector: 'query-selector',
  templateUrl: './query-selector.component.html',
  styleUrls: ['query-selector.component.scss'],
  providers: [FilterModalService]
})
/**
 * This component on UI gives user access to select report category fields & their aggregate functions.
 * User can also add Filters & pivots using this component & apply his changes.
 */
export class QuerySelectorComponent implements OnInit {

  //@Input() dataQuery: Query; //This field is required to get/set Pivot & filter groups.
  @Input() filterGroup: FilterGroup; //This field is required to get/set filter groups.
  @Input() pivotGroup: PivotGroup; //This field is required to get/set pivot groups.
  @Input() reportCategoryFields: any[] = [];//To display measures & dimensions on UI.

  @Output() submit: EventEmitter<any> = new EventEmitter<any>(); //Submit event to apply user changes on report category fields, pivot & filters.

  /**
   * @param filterModalService - For Filter group model popup.
   * @param pivotModalService - For Pivot group model popup.
   */
  constructor(private filterModalService: FilterModalService, private pivotModalService: PivotModalService) {

  }

  /**
   * Initialise Pivot & Filter group if null.
   */
  ngOnInit() {
    // this.dataQuery.pivots[0] = (this.dataQuery.pivots[0]?this.dataQuery.pivots[0]:new PivotGroup());
    // this.dataQuery.filters[0] = (this.dataQuery.filters[0]?this.dataQuery.filters[0]:new FilterGroup());
  }

  /**
   * On click of Apply button on UI. Publish the event to parent component.
   */
  public applyChanges() {
    let obj = {};
    obj["filterGroup"] = this.filterGroup;
    obj["pivotGroup"] = this.pivotGroup;
    this.submit.emit(obj);
  }

  /**
   * On click of Filter button open the Filter popup.
   * It passes the clone object of FilterGroup to maintain the state of object on cancel & dismiss event.
   */
  public openFilterModal(){
    let filterFields = JSON.parse(JSON.stringify(this.reportCategoryFields));
    let aggregateFields = [];
    for(let i=0;i<filterFields.length; i++) {
      if(filterFields[i].function && filterFields[i].isDefault) {
        let field = JSON.parse(JSON.stringify(filterFields[i]));
        field.id = field.id * 50;
        field.name = field.displayValue;
        field.havingFlag = true;
        aggregateFields.push(field);
      }
    }
    this.filterModalService.activate({schemaDef: this.reportCategoryFields, filterGroup: JSON.parse(JSON.stringify(this.filterGroup)), aggregateFields: aggregateFields, _parent:this}).then((res) => {
      console.log(res);
    });
  }

  /**
   * On apply filters.
   * @param event
   */
  public onFilterSubmit(event: any){
    this.filterGroup = event.filterGroup;
  }

  /**
   * On cancel/dismiss Filter popup model.
   * @param event
   */
  public onFilterCancel(event: any){
    // Do Nothing
  }

  /**
   * On click of Pivot button open the Pivot popup.
   * It passes the clone object of PivotGroup to maintain the state of object on cancel & dismiss event.
   */
  public openPivotModal(){
    this.pivotModalService.activate({schemaDef: this.reportCategoryFields, pivotGroup: JSON.parse(JSON.stringify(this.pivotGroup)), _parent:this}).then((res) => {
      console.log(res);
    });
  }

  /**
   * On apply Pivots.
   * @param event
   */
  public onPivotSubmit(event: any) {
    this.pivotGroup = event.pivotGroup;
  }

  /**
   * On cancel/dismiss Pivot popup model.
   * @param event
   */
  public onPivotCancel(event: any){
    // Do nothing
  }

  /**
   * On change of checkbox on each field, this method maintains the
   * field's function & display value.
   * @param val
   * @param field
   */
  private setFunction(val, field): void {
    if(val == "sum") {
      field.function = val;
      field.displayValue = "Sum of " + field.name;
    } else if(val == "count") {
      field.function = val;
      field.displayValue = "Count of " + field.name;
    } else if(val == "avg") {
      field.function = val;
      field.displayValue = "Average of " + field.name;
    } else if(val == "day") {
      field.function = val;
      field.displayValue = "Day of " + field.name;
    } else if(val == "month") {
      field.function = val;
      field.displayValue = "Month of " + field.name;
    } else if(val == "quarter") {
      field.function = val;
      field.displayValue = "Quarter of " + field.name;
    } else if(val == "year") {
      field.function = val;
      field.displayValue = "Year of " + field.name;
    } else {
      field.function = val;
      field.displayValue = field.name;
    }
  }
}
