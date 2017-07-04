import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableInputConfig, IDataTableInputConfig } from "../datatable/interfaces/datatable.interface";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTableService } from "../datatable/services/datatable.service";
import { PluralService } from "../../../../wize-ng2-core/core/shared/services/pluralize.service";
import { UIConfigService } from "../../../../wize-ng2-core/core/shared/services/index";
import { DomSanitizer } from "@angular/platform-browser";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
    selector: 'row-detail',
    templateUrl: './row-detail.html',
    styleUrls: ['row-detail.scss'],
    providers: []
})
export class RowDetailComponent implements OnInit {
    docURL: string = undefined;
    id: string;
    options: any;
    route: string;
    columns: any[] = [];
    relationships: any[] = [];
    rowData: any;
    filter: any = [];
    entity: any;
    showAddModal: boolean = false;
    editColumns: Array<any> = [];
    name: string = "detailView";
    closeAddEditModalSubscription: Subscription;
    routes: any[];
    dataTableInputConfig: IDataTableInputConfig;
    redocFrameWidth: any;
    activeTabIndex: number = 0;
    safeUrl: any;
    show: boolean = false;
    source: string;
    editorOptions: any;
    isFrameLoaded: boolean = false;

    @ViewChild('redocFrame') public redocFrame: any;
    @ViewChild('codeEditor') public codeEditor: any;

    constructor(private dataTableService: DataTableService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private pluralService: PluralService,
                private uiConfigService: UIConfigService,
                private sanitizer: DomSanitizer) {

        this.route = this.activatedRoute.snapshot.params['route'];
        this.id = this.activatedRoute.snapshot.params['id'];
        this.routes = this.uiConfigService.getConfig();
        this.options = this.uiConfigService.getConfigByRoute(this.activatedRoute.snapshot.params['route']);
        this.closeAddEditModalSubscription = dataTableService.closeAddEditModal$.subscribe(
            item => {
                this.onModalClosed(item);
            });
        this.dataTableInputConfig = new DataTableInputConfig(this.routes, "", false, false, null);

        this.editorOptions = {
            smartIndent: true,
            lineNumbers: true,
            showCursorWhenSelecting: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            //mimeModes: "text/javascript,application/json",
            mode: {name: "javascript", json: true, globalVars: true},
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        };
    }

    ngOnInit() {
        this.entity = this.options.entities.find((entity) => {
            return entity.primary === true
        });
        this.getColumns();
        this.getRelationships();
        this.getRowDetail();
    }

    addRecord(route: string, type: string) {
        if (type !== "belongsToMany") {
            let cols = this.dataTableService.getColumns(this.getRelationshipOptions(route));
            cols = this.dataTableService.getColumnsWithValue(cols, null, false);
            this.dataTableService.showAddEditModal({
                primaryEntity: this.entity,
                entity: this.getRelationshipOptions(route),
                title: 'Add Record',
                mode: "form",
                row: {},
                edit: false,
                routes: this.routes,
                customFormData: {
                    attributes: cols,
                    settings: {}
                }
            });
        }
        else {
            this.dataTableService.showAddEditModal({
                primaryEntity: this.entity,
                entity: this.getRelationshipOptions(route),
                target: route,
                title: `Add ${route} to ${ this.entity.name }`,
                mode: "table",
                row: {},
                edit: false,
                routes: this.routes,
                customFormData: {attributes: [], settings: {}}
            });
        }
    }

    editRecord() {
        this.editColumns = this.dataTableService.getColumnsWithValue(this.columns, this.rowData, true);
        this.dataTableService.showAddEditModal({
            entity: this.entity,
            title: 'Edit Record',
            target: null,
            mode: "form",
            row: this.rowData,
            edit: true,
            customFormData: {
                attributes: this.editColumns,
                settings: {}
            }
        });
    }

    getColumns() {
        this.columns = this.dataTableService.getColumns(this.entity);
    }

    getRelationships() {
        this.relationships = this.dataTableService.getRelationships(this.entity);
    }

    getRelationshipOptions(route: string) {
        return this.options.entities.find((entity) => {
            return entity['name'] === route
        });
    }

    getRowDetail() {
        this.dataTableService.getRowDetail(this.entity.apis.get, this.id).subscribe((data) => {
            this.rowData = data;
        });
    }

    onModalClosed(data: any) {
        this.showAddModal = false;
    }

    getConfig(entityName) {
        return new DataTableInputConfig(this.routes, entityName, false, false, null);
    }

    refreshModel(event) {
        if (event.name === this.entity.name) {
            this.getRowDetail();
        }
    }

    getIdentifier(){
        const uniqueCol = this.columns.find((c) => {
            return c.viewOptions.noUnique === false;
        });
        if(this.rowData && uniqueCol){
            return this.rowData[uniqueCol.name]
        }
        return this.rowData ? this.rowData['id'] : 'N/A';
    }
}
