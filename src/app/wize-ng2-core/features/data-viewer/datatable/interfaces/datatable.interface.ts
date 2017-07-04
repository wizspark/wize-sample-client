export interface IColumn {
    field: string;
    header: string;
    editable?: boolean;
    sortable?: boolean;
}

export interface IFilterMetadata {
    value?: any;
    matchMode?: string;
}

export interface ISortMeta {
    field: string;
    order: number;
}

export interface ILazyLoadEvent {
    first: number;
    rows: number;
    sortField: string;
    sortOrder: number;
    filters: IFilterMetadata;
    multiSortMeta: ISortMeta;
}

export interface IOptions {
    /* Basic Config */

    value: any[];
    columns: IColumn[];
    responsive: boolean;
    header?: string;
    footer?: string;
    resizableColumns: boolean; // Should be true
    columnResizeMode?: boolean; // Should be false
    reorderableColumns: boolean; // Should be true
    exportFilename?: string;
    emptyMessage?: string;
    /*
     1. Custom Actions Not Supported in v1
     2. Col Grouping Not Supported in v1
     */

    /* Grouping */

    sortField?: string; // Sort By Column
    rowGroupMode?: string; // subheader
    groupField?: string; // Group By Column
    expandableRowGroups?: boolean;
    sortableRowGroup?: boolean;

    /* Pagination Config Attributes */

    paginator?: boolean;
    pageLinks?: number;
    rowsPerPageOptions?: number[];
    rows?: number;
    totalRecords?: number;

    /* Infinite Scroll */
    scrollHeight: string;
    virtualScroll: boolean;
    scrollable?: boolean;

    /* Sorting
     * Note: Column level sorting should be defined in column
     * */

    sortMode?: string; //multiple , default - null

    /* Global Search Feature - Client Side Only */

    globalFilter?: any; // Pass input textbox local variable
    filterDelay: number;

    /* Selection Modes */
    selectionMode?: string; // single or multiple

    /* Editable
     * Note: update editable in column interface also*/
    editable?: boolean;

    /* Detailed Expanded View */
    expandableRows: boolean;
}


export interface IDataTableInputConfig {
    routes: any[];
    isHeader: boolean;
    isSelection: boolean;
    entityName: string;
    headerOptions: any;
    isAssociation: boolean;
    belongsToMany: boolean;
}

export class DataTableInputConfig implements IDataTableInputConfig {
    routes: any[] = [];
    isHeader: boolean = false;
    isSelection: boolean = false;
    entityName: string;
    headerOptions: any;
    isAssociation: boolean;
    belongsToMany: boolean = false;
    constructor(routes: any[], entityName: string, header?: boolean, checkboxSelection?: boolean, headerOptions?: any, isAssociation?: boolean, belongsToMany?: boolean
){
        this.routes = routes;
        this.entityName = entityName;
        this.isHeader = header ? header : false;
        this.isSelection = checkboxSelection ? checkboxSelection : false;
        this.headerOptions = headerOptions;
        this.isAssociation = isAssociation? isAssociation : false;
        this.belongsToMany = belongsToMany? belongsToMany : false;
    }
}

export class Filter {
    operator: string = 'OR';
    column: string = null;
    value: string = null;
    expression: string = null;
    constructor(operator, column, expression, value){
        this.operator = operator;
        this.column = column;
        this.expression = expression;
        this.value = value;
    }
}



